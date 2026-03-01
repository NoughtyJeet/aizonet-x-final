
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  if (!post) return null;

  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className={`group flex flex-col bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ${featured ? 'md:flex-row md:min-h-[400px]' : ''}`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : 'aspect-[16/10]'}`}>
        <img 
          src={post.imageUrl || `https://picsum.photos/seed/${post.id}/800/450`} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Category Badge - Glass Style */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-slate-900/60 dark:bg-indigo-950/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
            {post.category}
          </span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className={`p-8 flex flex-col ${featured ? 'md:w-1/2 md:justify-center' : 'flex-grow'}`}>
        {/* Meta Info: Date and Author */}
        <div className="flex items-center gap-2 mb-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
          <span>{post.date}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>{post.author?.name || 'AIZONET EDITOR'}</span>
        </div>
        
        {/* Title */}
        <h3 className={`font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${featured ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-8 text-sm md:text-base">
          {post.excerpt}
        </p>
        
        {/* Read More Link */}
        <div className="mt-auto flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
          <span>Read Article</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
