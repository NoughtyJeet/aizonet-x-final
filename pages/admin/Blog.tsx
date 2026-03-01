
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { BlogPost } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import { MOCK_AUTHORS } from '../../constants';

const BLOG_CATEGORIES = ['AI News', 'AI Tools Reviews', 'AI Tutorials', 'Industry Updates'] as const;

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    category: 'AI News',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: []
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category: 'AI News',
      excerpt: '',
      content: '',
      imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/1200/630',
      tags: [],
      author: MOCK_AUTHORS.alex,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      metaTitle: '',
      metaDescription: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(formData.title || '');
    const postData = { 
      ...formData, 
      slug,
      metaTitle: formData.title + ' | AIZONET',
      metaDescription: formData.excerpt
    } as BlogPost;

    try {
      if (editingPost) {
        await supabaseService.upsertPost({ ...postData, id: editingPost.id });
      } else {
        const newPost = { ...postData, id: Math.random().toString(36).substr(2, 9) };
        await supabaseService.upsertPost(newPost);
      }
      loadPosts();
      closeModal();
      window.dispatchEvent(new Event('blogUpdated'));
    } catch (err: any) {
      console.error('Failed to save post:', err);
      alert(`Failed to save post: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // Need to add deletePost to supabaseService
        await (supabaseService as any).deletePost(id);
        loadPosts();
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  return (
    <AdminLayout title="Blog Management">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search posts..." 
            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 pl-12 outline-none dark:text-white focus:ring-2 focus:ring-indigo-600"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white font-black px-6 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
        >
          <span>📝</span> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 overflow-hidden group shadow-sm flex flex-col">
            <div className="relative h-48">
              <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{post.category}</span>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-1">{post.title}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-grow">{post.excerpt}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400">{post.date}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(post)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    title="Edit Post"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    title="Delete Post"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 border dark:border-slate-800">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black dark:text-white">
                {editingPost ? 'Edit Blog Post' : 'Create New Post'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 overflow-y-auto max-h-[75vh] space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Post Title</label>
                  <input 
                    required
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="e.g. 10 AI Tools to Boost Productivity"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                    <select 
                      value={formData.category || 'AI News'}
                      onChange={e => setFormData({...formData, category: e.target.value as any})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      {BLOG_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Cover Image URL</label>
                    <input 
                      required
                      type="text"
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Excerpt</label>
                  <textarea 
                    required
                    rows={2}
                    value={formData.excerpt || ''}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="A short summary of the post for cards and SEO..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.tags?.join(', ') || ''} 
                    onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" 
                    placeholder="AI, Tech, Future..." 
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Content (Use HTML for Formatting)</label>
                  <textarea 
                    required
                    rows={8}
                    value={formData.content || ''}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-sm"
                    placeholder="<p>Wrap text in P tags...</p> <h2>Subheading</h2> <ul><li>List item</li></ul>"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Tip: Use &lt;p&gt; for paragraphs, &lt;h2&gt; for subheadings, and &lt;ul&gt;&lt;li&gt; for lists to ensure perfect formatting.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                >
                  {editingPost ? 'Save Post Changes' : 'Publish Blog Post'}
                </button>
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;
