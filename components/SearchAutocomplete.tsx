
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Zap, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { AITool, BlogPost } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const SearchAutocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tools, setTools] = useState<AITool[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setTools([]);
        setPosts([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);
      try {
        const [toolsData, postsData] = await Promise.all([
          supabaseService.searchTools(query),
          supabaseService.searchPosts(query)
        ]);
        setTools(toolsData);
        setPosts(postsData);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/tools?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search 250+ AI tools, reviews, and comparisons..."
            className="w-full pl-16 pr-16 py-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] text-xl font-medium shadow-2xl shadow-indigo-600/5 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all dark:text-white"
          />
          {loading ? (
            <Loader2 className="absolute right-6 w-6 h-6 text-indigo-600 animate-spin" />
          ) : query ? (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="absolute right-6 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          ) : null}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (query.length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {tools.length === 0 && posts.length === 0 && !loading ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-slate-500 font-medium">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {tools.length > 0 && (
                    <div>
                      <div className="px-4 mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Tools</span>
                        <span className="text-[10px] font-black text-indigo-600">{tools.length} found</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {tools.map(tool => (
                          <Link 
                            key={tool.id} 
                            to={`/tool/${tool.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group"
                          >
                            <img src={tool.logoUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                            <div className="flex-1">
                              <h4 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{tool.name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                            </div>
                            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-widest">
                              {tool.category}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {posts.length > 0 && (
                    <div>
                      <div className="px-4 mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reviews & Articles</span>
                        <span className="text-[10px] font-black text-amber-600">{posts.length} found</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {posts.map(post => (
                          <Link 
                            key={post.id} 
                            to={`/blog/${post.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group"
                          >
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">{post.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{post.excerpt}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Press Enter to see all results</p>
              <Link 
                to={`/tools?search=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
              >
                View all results
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAutocomplete;
