
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { AITool, Category, ProgrammaticComparison } from '../types';
import { supabaseService } from '../services/supabaseService';
import { comparisonService } from '../services/comparisonService';
import { CATEGORIES, MOCK_TOOLS } from '../constants';
import { ArrowRight, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comparisons, setComparisons] = useState<ProgrammaticComparison[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [toolsData, catsData, compsData] = await Promise.all([
          supabaseService.getTools(),
          supabaseService.getCategories(),
          comparisonService.getComparisons()
        ]);
        
        const activeTools = toolsData.filter(t => t.status === 'active' || !t.status);
        setTools(activeTools);
        setComparisons(compsData.filter(c => c.status === 'published').slice(0, 4));

        // Calculate dynamic counts based on the current tools list
        const updatedCats = catsData.map((cat: Category) => ({
          ...cat,
          count: activeTools.filter((t: AITool) => t.category === cat.name).length
        }));
        
        setCategories(updatedCats);
      } catch (err) {
        console.error('Failed to load home data:', err);
        setTools(MOCK_TOOLS);
        setCategories(CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNewsletterJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // In a real application, this would send the data to hello@aizonet.in
    console.log(`New subscriber: ${email} registered for hello@aizonet.in`);
    setIsSubscribed(true);
  };

  const trendingTools = tools.filter(t => t.isTrending).slice(0, 3);
  const featuredTools = tools.filter(t => t.isFeatured).slice(0, 3);
  const displayTools = trendingTools.length > 0 ? trendingTools : tools.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.1)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.2)_0%,rgba(15,23,42,0)_100%)]" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-10 border border-indigo-100 dark:border-indigo-800">
             <span>✨</span> The #1 AI Resource for 2026
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[0.9] mb-8">
            Navigate the <span className="text-indigo-600 dark:text-indigo-400">AI Revolution</span> with AIZONET.
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            The world's most comprehensive directory of artificial intelligence tools. Categorized, reviewed, and updated daily to help you find your edge in 2026.
          </p>
          
          <div className="mt-16 max-w-4xl mx-auto">
            <SearchAutocomplete />
          </div>

          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/tools" className="rounded-2xl bg-indigo-600 px-10 py-5 text-xl font-black text-white transition-all hover:bg-indigo-700 hover:scale-105 shadow-2xl shadow-indigo-600/30">
              Explore {tools.length}+ Tools
            </Link>
            <Link to="/submit-tool" className="rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-10 py-5 text-xl font-black text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
              Submit Your Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-none">Browse by Expertise</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Find specialized tools tailored for your unique creative and technical challenges in 2026.</p>
          </div>
          <Link to="/categories" className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-sm">View All Categories</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 8).map(cat => (
            <Link 
              key={cat.id} 
              to={`/tools?category=${encodeURIComponent(cat.name)}`} 
              className="group relative p-10 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] text-center hover:border-indigo-600 dark:hover:border-indigo-400 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-600/10 hover:-translate-y-2"
            >
              <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500 ease-out">{cat.icon}</div>
              <h3 className="font-black text-slate-900 dark:text-white mb-2 text-xl leading-tight">{cat.name}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cat.count} Tools</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tools Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-32 border-y dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest mb-4">
                 🔥 Hottest Tools
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Trending this Week</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-4">The most innovative tools that the AI community is talking about right now in 2026.</p>
            </div>
            <Link to="/tools" className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all text-sm shadow-xl shadow-indigo-600/20">Explore full directory</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Tool Comparisons Section */}
      {comparisons.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                 ⚔️ Tool Face-offs
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Popular Comparisons</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-4">Can't decide? We've compared the top AI tools head-to-head to help you choose.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisons.map(comp => (
              <Link key={comp.id} to={`/compare/${comp.slug}`} className="group p-8 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] hover:border-indigo-600 transition-all flex items-center justify-between shadow-sm hover:shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    <img src={comp.tool1?.logoUrl} className="w-14 h-14 rounded-2xl border-4 border-white dark:border-slate-900 object-cover" alt="" />
                    <img src={comp.tool2?.logoUrl} className="w-14 h-14 rounded-2xl border-4 border-white dark:border-slate-900 object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {comp.tool1?.name} <span className="text-slate-400">vs</span> {comp.tool2?.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">Expert Comparison & Verdict</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Editor's Choice */}
      <section className="container mx-auto px-4">
        <div className="mb-16">
           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Editor's Choice</h2>
           <p className="text-slate-500 dark:text-slate-400">Our team's pick for the most impactful AI tools of the month.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {featuredTools.map(tool => (
             <ToolCard key={tool.id} tool={tool} />
           ))}
        </div>
      </section>

      {/* Final CTA / Newsletter Section */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-900 dark:bg-indigo-950/20 rounded-[3.5rem] p-16 md:p-24 relative overflow-hidden text-center text-white border border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />
          <div className="relative z-10 max-w-3xl mx-auto">
            {isSubscribed ? (
              <div className="animate-in fade-in zoom-in duration-500 py-10">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-4xl md:text-6xl font-black mb-6">Thank you for subscribing!</h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  You are now part of the AIZONET community. We've sent a confirmation message to your inbox via <span className="text-indigo-400 font-bold">hello@aizonet.in</span>. Stay tuned for the latest AI insights!
                </p>
                <button 
                  onClick={() => setIsSubscribed(false)}
                  className="mt-10 text-indigo-400 font-black hover:text-indigo-300 transition-colors uppercase tracking-widest text-sm"
                >
                  Join with another email
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Join the largest AI community in the world.</h2>
                <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                  Get weekly updates on new tools, trends, and tutorials curated for the 2026 AI landscape.
                </p>
                <form onSubmit={handleNewsletterJoin} className="flex flex-col md:flex-row gap-4 justify-center items-center">
                   <div className="relative w-full md:w-96">
                     <input 
                       required
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Enter your email address"
                       className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-5 px-6 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-indigo-600"
                     />
                   </div>
                   <button 
                    type="submit"
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-12 rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 text-lg active:scale-95"
                   >
                     Join the Newsletter
                   </button>
                </form>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                   <Link to="/submit-tool" className="text-slate-400 hover:text-white font-black py-2 px-4 transition-all text-sm uppercase tracking-widest">
                     Submit Your Tool
                   </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
