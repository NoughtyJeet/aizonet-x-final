
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { AITool, Category } from '../../types';
import { supabaseService } from '../../services/supabaseService';

const AdminTools: React.FC = () => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<AITool>>({
    name: '',
    category: '',
    description: '',
    pricing: 'Free',
    websiteUrl: '',
    logoUrl: '',
    tags: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [toolsData, catsData] = await Promise.all([
        supabaseService.getTools(),
        supabaseService.getCategories()
      ]);
      setTools(toolsData);
      setCategories(catsData);
      if (catsData.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: catsData[0].name }));
      }
    } catch (err) {
      console.error('Failed to load tools data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : 'Productivity',
      description: '',
      pricing: 'Free',
      websiteUrl: '',
      logoUrl: '',
      tags: [],
      rating: 4.0,
      reviewCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tool: AITool) => {
    setEditingTool(tool);
    setFormData(tool);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTool(null);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(formData.name || '');
    const toolData = { 
      ...formData, 
      slug,
      logoUrl: formData.logoUrl || `https://picsum.photos/seed/${formData.name}/200`,
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : [formData.category || 'AI']
    } as AITool;

    try {
      if (editingTool) {
        await supabaseService.upsertTool({ ...toolData, id: editingTool.id });
      } else {
        const newTool = { ...toolData, id: Math.random().toString(36).substr(2, 9) };
        await supabaseService.upsertTool(newTool);
      }
      loadData();
      closeModal();
    } catch (err: any) {
      console.error('Failed to save tool:', err);
      alert(`Failed to save tool: ${err.message || 'Unknown error'}`);
    }
  };

  const toggleStatus = async (id: string, field: 'isFeatured' | 'isTrending') => {
    const tool = tools.find(t => t.id === id);
    if (!tool) return;
    
    try {
      await supabaseService.upsertTool({ ...tool, [field]: !tool[field] });
      loadData();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const deleteTool = async (id: string) => {
    if (window.confirm('Delete this tool permanently?')) {
      try {
        await supabaseService.deleteTool(id);
        loadData();
      } catch (err) {
        console.error('Failed to delete tool:', err);
      }
    }
  };

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Tools">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search tools by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white font-black px-6 py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <span>➕</span> Add New Tool
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
              <th className="p-6 font-black uppercase text-[10px] text-slate-400">Tool Details</th>
              <th className="p-6 font-black uppercase text-[10px] text-slate-400">Category</th>
              <th className="p-6 font-black uppercase text-[10px] text-slate-400 text-center">Featured</th>
              <th className="p-6 font-black uppercase text-[10px] text-slate-400 text-center">Trending</th>
              <th className="p-6 font-black uppercase text-[10px] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {filteredTools.map(tool => (
              <tr key={tool.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={tool.logoUrl} className="h-12 w-12 rounded-xl object-cover bg-slate-100" />
                    <div>
                      <h4 className="font-bold dark:text-white">{tool.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{tool.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-sm font-medium dark:text-slate-400">{tool.category}</span>
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => toggleStatus(tool.id, 'isFeatured')}
                    className={`h-6 w-11 rounded-full relative transition-colors ${tool.isFeatured ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tool.isFeatured ? 'left-6' : 'left-1'}`} />
                  </button>
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => toggleStatus(tool.id, 'isTrending')}
                    className={`h-6 w-11 rounded-full relative transition-colors ${tool.isTrending ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tool.isTrending ? 'left-6' : 'left-1'}`} />
                  </button>
                </td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => openEditModal(tool)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">✏️</button>
                  <button onClick={() => deleteTool(tool.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 border dark:border-slate-800">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black dark:text-white">{editingTool ? 'Edit AI Tool' : 'Add New Tool'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-8 overflow-y-auto max-h-[75vh] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tool Name</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" placeholder="e.g. ChatMagic" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                  <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Website URL</label>
                  <input required type="url" value={formData.websiteUrl || ''} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Pricing Model</label>
                  <select value={formData.pricing || 'Free'} onChange={e => setFormData({...formData, pricing: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600">
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Logo Image URL</label>
                <input type="url" value={formData.logoUrl || ''} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" placeholder="https://.../logo.png" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Short Description</label>
                <textarea required rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" placeholder="Briefly describe what this tool does..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Features (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.features?.join(', ') || ''} 
                    onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" 
                    placeholder="Feature 1, Feature 2..." 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.tags?.join(', ') || ''} 
                    onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600" 
                    placeholder="Tag 1, Tag 2..." 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">{editingTool ? 'Save Changes' : 'Publish Tool'}</button>
                <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTools;
