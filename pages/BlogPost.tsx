
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogCard from '../components/BlogCard';
import AdSlot from '../components/AdSlot';
import { BlogPost } from '../types';
import { supabaseService } from '../services/supabaseService';
import { MOCK_POSTS } from '../constants';

const BlogPostTemplate: React.FC = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allPosts = await supabaseService.getPosts();
        setPosts(allPosts);
        const found = allPosts.find(p => p.slug === slug);
        if (found) setPost(found);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setPosts(MOCK_POSTS);
        const found = MOCK_POSTS.find(p => p.slug === slug);
        if (found) setPost(found);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (!post) {
    return (
      <div className="py-40 text-center animate-in fade-in duration-500">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-2xl font-black dark:text-white">Post not found.</h2>
        <Link to="/blog" className="mt-6 inline-block text-indigo-600 font-bold hover:underline">Back to Blog</Link>
      </div>
    );
  }

  const relatedPosts = posts.filter(p => post.relatedPosts?.includes(p.id));

  return (
    <div className="pb-20">
      <SEO 
        title={post.metaTitle}
        description={post.metaDescription}
        ogImage={post.imageUrl}
        ogType="article"
        author={post.author.name}
        publishedDate={post.date}
        tags={post.tags}
      />

      <div className="relative pt-20 pb-12 md:pt-32 md:pb-20 border-b dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
             <Link to="/blog" className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
               {post.category}
             </Link>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.date}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8">{post.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-40 space-y-12">
              {post.toc && post.toc.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 px-4">Contents</h4>
                  <nav className="space-y-1">
                    {post.toc.map(item => (
                      <a key={item.id} href={`#${item.id}`} className="block px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">{item.text}</a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>

          <div className="lg:col-span-6">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white dark:border-slate-800">
               <img src={post.imageUrl} className="w-full h-auto" alt={post.title} />
            </div>

            <AdSlot placement="blogContent" className="mb-12" />

            <article 
              className="prose prose-lg md:prose-xl prose-indigo dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-img:rounded-3xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-12 border-t dark:border-slate-800 flex flex-wrap gap-2">
               {post.tags.map(tag => (
                 <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-500 uppercase">#{tag}</span>
               ))}
            </div>

            <div className="mt-20 p-8 md:p-12 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center border dark:border-slate-800">
               <img src={post.author.imageUrl} className="h-24 w-24 rounded-3xl object-cover shadow-lg" alt={post.author.name} />
               <div className="text-center md:text-left">
                  <h4 className="text-xl font-black mb-1 dark:text-white">{post.author.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{post.author.bio}</p>
               </div>
            </div>
          </div>

          <aside className="lg:col-span-3">
             <div className="sticky top-40 space-y-8">
               <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-600/20">
                  <h5 className="text-xl font-black mb-4">Discover Top AI Tools</h5>
                  <Link to="/tools" className="block w-full bg-white text-indigo-600 font-black py-4 rounded-2xl hover:bg-slate-50 transition-colors">Explore</Link>
               </div>
               {relatedPosts.length > 0 && (
                 <div className="space-y-4">
                   <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Related Posts</h4>
                   {relatedPosts.map(rp => (
                     <Link key={rp.id} to={`/blog/${rp.slug}`} className="block group">
                       <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">{rp.title}</h5>
                     </Link>
                   ))}
                 </div>
               )}
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPostTemplate;
