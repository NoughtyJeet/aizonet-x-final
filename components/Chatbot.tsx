
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatQuery } from '../services/geminiService';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Greetings! I am ZONET, your AIZONET guide. How can I assist your discovery of AI tools today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef({ input: '', output: '' });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const stopVoice = useCallback(() => {
    if (liveSessionRef.current) {
      try { liveSessionRef.current.close(); } catch(e) {}
      liveSessionRef.current = null;
    }
    
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (audioContextInRef.current) {
      audioContextInRef.current.close().catch(() => {});
      audioContextInRef.current = null;
    }
    if (audioContextOutRef.current) {
      audioContextOutRef.current.close().catch(() => {});
      audioContextOutRef.current = null;
    }

    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    audioSourcesRef.current.clear();
    
    setIsVoiceActive(false);
    nextStartTimeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => stopVoice();
  }, [stopVoice]);

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsVoiceActive(true);
      
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextInRef.current = inCtx;
      audioContextOutRef.current = outCtx;
      
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            if (!audioContextInRef.current) return;
            const source = audioContextInRef.current.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              transcriptionBufferRef.current.output += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              transcriptionBufferRef.current.input += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const uText = transcriptionBufferRef.current.input;
              const mText = transcriptionBufferRef.current.output;
              if (uText || mText) {
                setMessages(prev => [
                  ...prev,
                  ...(uText ? [{ role: 'user', text: uText } as Message] : []),
                  ...(mText ? [{ role: 'model', text: mText } as Message] : [])
                ]);
              }
              transcriptionBufferRef.current = { input: '', output: '' };
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(source => {
                try { source.stop(); } catch (e) {}
              });
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopVoice();
          },
          onclose: () => stopVoice(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are ZONET, the robotic AI assistant for AIZONET. Friendly, concise, high-tech persona.',
        }
      });

      liveSessionRef.current = await sessionPromise;

    } catch (err) {
      console.error('Failed to start voice mode:', err);
      setIsVoiceActive(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowWelcome(false);
    if (isOpen) stopVoice();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: input }] });

      const response = await sendChatQuery(history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Neural link error. Please try again.' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans pointer-events-none">
      <div className="relative pointer-events-auto flex flex-col items-end">
        {showWelcome && !isOpen && (
          <div className="mb-4 mr-2 w-48 bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-br-none shadow-2xl border dark:border-slate-700 animate-bounce-subtle relative">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Hello, I am your AI assistant, how can I help you today?
            </p>
            <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b dark:border-slate-700 rotate-45 transform origin-top-right" />
          </div>
        )}

        <button 
          onClick={handleToggle}
          className={`relative w-20 h-20 md:w-24 md:h-24 transition-all duration-500 hover:scale-110 active:scale-95 group ${isOpen ? 'grayscale-0' : ''}`}
        >
          <div className={`${!isOpen ? 'animate-robot-walk' : ''} drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]`}>
            <img 
              src="https://raw.githubusercontent.com/StackBlitz-Robot-Assistant/assets/main/robot-assistant.png" 
              alt="AI Assistant Robot" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/4712/4712139.png";
              }}
            />
          </div>
          <div className={`absolute bottom-2 right-2 h-3 w-3 ${isVoiceActive ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'} rounded-full border-2 border-white dark:border-slate-900 shadow-sm`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[350px] md:w-[400px] h-[550px] max-h-[75vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[-20px_20px_60px_-15px_rgba(79,70,229,0.3)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                 <img 
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png" 
                  className="w-6 h-6 invert"
                  alt="Avatar"
                />
              </div>
              <div>
                <h3 className="font-black tracking-tight">ZONET AI</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                  {isVoiceActive ? 'Voice Link Established' : 'Robotic Support Unit'}
                </p>
              </div>
            </div>
            <button onClick={() => {setIsOpen(false); stopVoice();}} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/20"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            {isVoiceActive && (
              <div className="flex justify-center py-4">
                <div className="flex gap-1.5 items-end h-8">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-indigo-500 rounded-full animate-pulse" 
                      style={{ height: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s` }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
            <div className="relative flex items-center gap-2">
              <button 
                onClick={() => (isVoiceActive ? stopVoice() : startVoice())}
                className={`p-3 rounded-2xl transition-all ${isVoiceActive ? 'bg-red-500 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600'}`}
                title={isVoiceActive ? "Stop Voice Mode" : "Start Voice Conversation"}
              >
                {isVoiceActive ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h12v2H6v-2zM12 2C9.24 2 7 4.24 7 7v6c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5z"/></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v8a3 3 0 01-6 0V7a3 3 0 013-3z"/></svg>
                )}
              </button>
              
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isVoiceActive ? "Listening..." : "Type your message..."}
                  disabled={isVoiceActive}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white transition-all disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || isVoiceActive}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes robot-walk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
        }
        .animate-robot-walk {
          animation: robot-walk 2.5s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
