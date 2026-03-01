
import React, { useState, useMemo, useEffect } from 'react';
import SEO from '../components/SEO';
import BlogCard from '../components/BlogCard';
import { BlogPost } from '../types';
import { supabaseService } from '../services/supabaseService';
import { MOCK_POSTS } from '../constants';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'AI News', 'AI Tools Reviews', 'AI Tutorials', 'Industry Updates'];

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await supabaseService.getPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  const featuredPost = posts[0];
  
  // Logic to determine which posts go into the grid
  const regularPosts = useMemo(() => {
    if (activeCategory === 'All') {
      // In 'All' view, hide the first post because it's featured at the top
      return filteredPosts.slice(1);
    }
    // In category views, show everything in the grid
    return filteredPosts;
  }, [filteredPosts, activeCategory]);

  return (
    <div className="pb-20">
      <SEO 
        title="AIZONET Blog | Latest AI News, Reviews & Tutorials 2026" 
        description="Stay ahead of the curve with deep dives into AI technology, comprehensive tool reviews, and step-by-step tutorials from the experts at AIZONET in 2026."
      />

      <div className="bg-slate-50 dark:bg-[#020617] pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] mb-8 tracking-tighter">
              Insights into <br/>
              <span className="text-indigo-600 dark:text-indigo-400 italic">the Future</span> of AI.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              We translate the complex world of artificial intelligence into actionable news, reviews, and tutorials in 2026.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        {/* Featured Post Area */}
        {activeCategory === 'All' && featuredPost && (
          <div className="mb-20">
            <BlogCard post={featuredPost} featured />
          </div>
        )}

        {/* Categories Bar */}
        <div className="sticky top-20 z-30 flex flex-wrap gap-2 mb-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-[2rem] border dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid View - Fixed 1/2/3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {regularPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-40 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed dark:border-slate-800">
            <div className="text-6xl mb-6 opacity-30">✍️</div>
            <h3 className="text-2xl font-black mb-2 dark:text-white">Editorial In Progress</h3>
            <p className="text-slate-500 dark:text-slate-400">Our researchers are currently crafting high-signal content for this category.</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="mt-40 container mx-auto px-4">
        <div className="bg-slate-950 dark:bg-[#0f172a] rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center text-white border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -mr-300 -mt-300" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Never miss an <br/> AI breakthrough.</h2>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed">
              Join 50,000+ industry leaders and get our weekly analysis of the AI tools reshaping the global economy.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-indigo-500 transition-colors"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                Join Now
              </button>
            </form>
            <p className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">NO SPAM. JUST SIGNAL. ONE EMAIL PER WEEK.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
