
import React, { useState } from 'react';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Message sent:', formState);
    setIsSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: '𝕏', url: 'https://x.com/jeetparganiha' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jeet-parganiha-b92305116/' },
    { name: 'Instagram', url: 'https://www.instagram.com/jeetparganiha/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@parganihaji' },
    { name: 'Facebook', url: 'https://www.facebook.com/jeet.parganiha.5' }
  ];

  if (isSent) {
    return (
      <div className="container mx-auto px-4 py-40 text-center">
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[3rem] border-2 border-indigo-100 dark:border-indigo-900 shadow-2xl animate-in zoom-in duration-300">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-4xl font-black mb-4 dark:text-white">Message Sent!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
          </p>
          <button onClick={() => setIsSent(false)} className="bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO 
        title="Contact Us | AIZONET Directory" 
        description="Have questions about AIZONET? Want to advertise or report an issue? Get in touch with our team today."
      />

      <div className="bg-slate-50 dark:bg-slate-900/40 pt-24 pb-32 border-b dark:border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
            Get in <span className="text-indigo-600 dark:text-indigo-400">Touch.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about advertising, tool submissions, or just want to say hi, we're here to listen.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border dark:border-slate-800 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formState.email}
                    onChange={e => setFormState({...formState, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                <select 
                  value={formState.subject}
                  onChange={e => setFormState({...formState, subject: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Advertising / Sponsorship</option>
                  <option>Tool Removal / Update</option>
                  <option>Partnership Request</option>
                  <option>Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="How can we help you?"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3 text-lg"
              >
                🚀 Send Message
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20">
               <h3 className="text-2xl font-black mb-6">Contact Info</h3>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">📧</div>
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200">Email Us</p>
                        <a href="mailto:hello@aizonet.in" className="text-lg font-bold hover:underline">hello@aizonet.in</a>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">📞</div>
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200">Call Us</p>
                        <a href="tel:+917999608471" className="text-lg font-bold hover:underline">+91 79996 08471</a>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🌐</div>
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-200">HQ Location</p>
                        <p className="text-lg font-bold">Cyber and Twin City, Bhilai</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
               <h3 className="text-2xl font-black mb-6 dark:text-white">Follow Us</h3>
               <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map(social => (
                    <a 
                      key={social.name} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-xs text-center border dark:border-slate-700"
                    >
                      {social.name}
                    </a>
                  ))}
               </div>
            </div>

            <div className="p-10 bg-amber-50 dark:bg-amber-950/20 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/40">
               <p className="text-sm text-amber-800 dark:text-amber-400 italic">
                 "Our team operates out of the heart of India's twin city hub. Feel free to reach out for high-level AI collaborations."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
