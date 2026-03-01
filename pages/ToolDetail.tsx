
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateToolSummary } from '../services/geminiService';
import ToolCard from '../components/ToolCard';
import { AITool } from '../types';
import { supabaseService } from '../services/supabaseService';
import { MOCK_TOOLS } from '../constants';

interface AIReviewData {
  summary: string;
  pros: string[];
  cons: string[];
}

const ToolDetail: React.FC = () => {
  const { slug } = useParams();
  const [tools, setTools] = useState<AITool[]>([]);
  const [tool, setTool] = useState<AITool | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIReviewData | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await supabaseService.getTools();
        const activeTools = data.filter(t => t.status === 'active' || !t.status);
        setTools(activeTools);
        
        const currentTool = activeTools.find(t => t.slug === slug);
        if (currentTool) setTool(currentTool);
      } catch (err) {
        console.error('Failed to load tool details:', err);
        setTools(MOCK_TOOLS);
        const currentTool = MOCK_TOOLS.find(t => t.slug === slug);
        if (currentTool) setTool(currentTool);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Auto scroll to top on change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (tool) {
      handleGetAnalysis();
    } else {
      setAiAnalysis(null);
    }
  }, [tool]);

  const handleGetAnalysis = async () => {
    if (!tool) return;
    setLoadingAi(true);
    try {
      const jsonStr = await generateToolSummary(tool.name, tool.description);
      const parsed: AIReviewData = JSON.parse(jsonStr || '{}');
      setAiAnalysis(parsed);
    } catch (e) {
      console.error("Failed to parse AI review", e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleShare = async () => {
    if (!tool) return;
    
    // In some environments, window.location.href might be invalid for sharing (e.g. data URLs or local files)
    // We try to normalize it to a string and ensure it's a valid URL format.
    const url = window.location.href;
    const shareData = {
      title: `${tool.name} | AIZONET Directory 2026`,
      text: tool.description,
      url: url,
    };

    try {
      // Use canShare if available to prevent the 'Invalid URL' crash before it happens
      if (navigator.share && (typeof navigator.canShare !== 'function' || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not available or URL not shareable');
      }
    } catch (err) {
      const errorName = (err as Error).name;
      // Don't show toast if user cancelled the share operation
      if (errorName !== 'AbortError') {
        console.warn('Native share failed or URL invalid, falling back to clipboard copy:', err);
        try {
          await navigator.clipboard.writeText(url);
          showToast("Link copied to clipboard!", "success");
        } catch (clipErr) {
          console.error('Clipboard fallback also failed:', clipErr);
        }
      }
    }
  };

  const handleWriteReview = () => {
    showToast("Review system is launching in Q3 2026. Stay tuned!", "info");
  };

  const showToast = (message: string, type: 'success' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    return tools
      .filter(t => t.id !== tool.id && (t.category === tool.category || t.tags.some(tag => tool.tags.includes(tag))))
      .slice(0, 3);
  }, [tool, tools]);

  if (!tool) return <div className="container mx-auto px-4 py-20 text-center">Tool not found</div>;

  return (
    <div className="pb-20 relative">
      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl font-bold text-white flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-600' : 'bg-indigo-600'}`}>
            <span>{toast.type === 'success' ? '✨' : '🚀'}</span>
            {toast.message}
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link to="/tools" className="hover:text-indigo-600">Directory</Link>
            <span>/</span>
            <Link to={`/tools?category=${encodeURIComponent(tool.category)}`} className="hover:text-indigo-600">
              {tool.category}
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-900 dark:text-white truncate">{tool.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Tool Identity Header */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative flex-shrink-0">
                <img 
                  src={tool.logoUrl} 
                  alt={tool.name} 
                  className="h-32 w-32 md:h-40 md:w-40 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl" 
                />
                {tool.isTrending && (
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg rotate-12 shadow-lg ring-4 ring-white dark:ring-slate-900">
                    Trending
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{tool.name}</h1>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold shadow-sm ${
                    tool.pricing === 'Free' ? 'bg-green-100 text-green-700' :
                    tool.pricing === 'Freemium' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-indigo-600 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-600/20">
              <div className="text-white text-center md:text-left">
                <h4 className="text-2xl font-bold mb-1">Try {tool.name} Today</h4>
                <p className="text-indigo-100 opacity-90">Experience the power of advanced AI.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 md:flex-none text-center bg-white text-indigo-600 hover:bg-slate-100 font-black py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Visit Website
                </a>
                <button 
                  onClick={handleShare}
                  className="p-4 bg-indigo-700/50 text-white rounded-2xl hover:bg-indigo-500 transition-colors"
                  title="Share Tool"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </div>

            {/* Main Description & Features */}
            <div className="space-y-12">
              <section className="prose prose-indigo dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold border-b pb-4 mb-6">About the Tool</h2>
                <p className="text-lg leading-loose text-slate-700 dark:text-slate-300">
                  {tool.longDescription || tool.description}
                </p>
              </section>

              {tool.features && tool.features.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold border-b pb-4 mb-8">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm">
                        <div className="mt-1 h-6 w-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gemini Analysis Section */}
              <section className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-3xl p-8 md:p-12 border-2 border-indigo-100 dark:border-indigo-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">AI-Powered Review</h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest">Powered by Gemini 3 Flash</p>
                    </div>
                  </div>
                  
                  {loadingAi ? (
                    <div className="space-y-4">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-full animate-pulse"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-5/6 animate-pulse"></div>
                      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                        {aiAnalysis ? aiAnalysis.summary : "Analyzing tool capabilities for the 2026 landscape..."}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div>
                          <h5 className="font-black text-green-600 uppercase text-xs tracking-widest mb-4">The Pros</h5>
                          <ul className="space-y-3">
                            {aiAnalysis?.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span className="text-green-500 flex-shrink-0">✔</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                            {!aiAnalysis && <li className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4"></li>}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-black text-amber-600 uppercase text-xs tracking-widest mb-4">The Cons</h5>
                          <ul className="space-y-3">
                            {aiAnalysis?.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span className="text-amber-500 flex-shrink-0">!</span>
                                <span>{con}</span>
                              </li>
                            ))}
                            {!aiAnalysis && <li className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3"></li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border dark:border-slate-700 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Specifications
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <span className="text-slate-500 font-medium">Category</span>
                  <Link to={`/tools?category=${encodeURIComponent(tool.category)}`} className="font-bold text-indigo-600 hover:underline">{tool.category}</Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Pricing</span>
                  <span className="font-bold">{tool.pricing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Avg. Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="font-bold">{tool.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Total Reviews</span>
                  <span className="font-bold">{tool.reviewCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Last Updated</span>
                  <span className="font-bold">May 2026</span>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <button 
                  onClick={handleShare}
                  className="w-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share Tool
                </button>
                <button 
                  onClick={handleWriteReview}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Similar AI Tools</h2>
              <Link to="/tools" className="text-indigo-600 font-bold hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;
