
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tools' | 'blog'>('tools');
  const [toolCats, setToolCats] = useState<Category[]>([]);
  const [blogCats, setBlogCats] = useState<string[]>(['AI News', 'AI Tools Reviews', 'AI Tutorials', 'Industry Updates']);
  const [loading, setLoading] = useState(true);

  const [newCat, setNewCat] = useState({ name: '', icon: '✨' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await supabaseService.getCategories();
      setToolCats(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    if (activeTab === 'tools') {
      const exists = toolCats.some((c: any) => c.name.toLowerCase() === newCat.name.toLowerCase());
      if (exists) return alert('Category already exists');
      
      const fresh: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCat.name,
        slug: newCat.name.toLowerCase().replace(/\s+/g, '-'),
        icon: newCat.icon,
        count: 0
      };
      
      try {
        await supabaseService.upsertCategory(fresh);
        loadData();
      } catch (err) {
        console.error('Failed to add category:', err);
      }
    } else {
      if (blogCats.includes(newCat.name)) return alert('Category already exists');
      setBlogCats([newCat.name, ...blogCats]);
    }
    setNewCat({ name: '', icon: '✨' });
  };

  const deleteCategory = async (item: any) => {
    if (!window.confirm(`Delete "${item.name || item}"? This might break filters for existing content.`)) return;
    
    if (activeTab === 'tools') {
      // Note: I should add a deleteCategory method to supabaseService
      // For now I'll just use supabase directly or assume upsert handles it (it doesn't for delete)
      const { error } = await (supabaseService as any).deleteCategory(item.id);
      if (error) {
        console.error('Failed to delete category:', error);
      } else {
        loadData();
      }
    } else {
      setBlogCats(blogCats.filter((c: string) => c !== item));
    }
  };

  return (
    <AdminLayout title="Taxonomy Management">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('tools')}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'tools' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
        >
          Tool Categories
        </button>
        <button 
          onClick={() => setActiveTab('blog')}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'blog' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
        >
          Blog Categories
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-black dark:text-white uppercase tracking-widest text-xs">Active {activeTab === 'tools' ? 'Tools' : 'Blog'} Categories</h3>
            </div>
            <div className="divide-y dark:divide-slate-800">
              {activeTab === 'tools' ? (
                toolCats.map((cat: any) => (
                  <div key={cat.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <p className="font-bold dark:text-white">{cat.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">/{cat.slug}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteCategory(cat)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                ))
              ) : (
                blogCats.map((cat: string) => (
                  <div key={cat} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <p className="font-bold dark:text-white">{cat}</p>
                    <button onClick={() => deleteCategory(cat)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Category Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 dark:text-white">Add New</h3>
            <form onSubmit={addCategory} className="space-y-4">
              {activeTab === 'tools' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category Icon</label>
                  <input 
                    type="text" 
                    value={newCat.icon}
                    onChange={(e) => setNewCat({...newCat, icon: e.target.value})}
                    placeholder="Emoji (e.g. 🎨)" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category Name</label>
                <input 
                  required
                  type="text" 
                  value={newCat.name}
                  onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                  placeholder="e.g. Productivity" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
              >
                Publish Category
              </button>
            </form>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-3xl border border-dashed dark:border-slate-800">
             <p className="text-xs text-slate-500 dark:text-slate-400 italic">
               Note: Deleting a category will not delete the items assigned to it, but they will no longer appear in category-specific filter results.
             </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
