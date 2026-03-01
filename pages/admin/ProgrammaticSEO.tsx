import React, { useState, useEffect } from 'react';
import { comparisonService } from '../../services/comparisonService';
import { ProgrammaticComparison } from '../../types';
import { Plus, RefreshCw, Globe, FileText, Trash2, CheckCircle, Clock, AlertCircle, Search, Filter, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';

const ProgrammaticSEO: React.FC = () => {
  const [comparisons, setComparisons] = useState<ProgrammaticComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProgrammaticComparison>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await comparisonService.getComparisons();
      setComparisons(data);
    } catch (err) {
      console.error('Failed to load comparisons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateCombinations = async () => {
    try {
      setGenerating(true);
      await comparisonService.generateCombinations();
      await loadData();
      alert('20 new combinations generated successfully!');
    } catch (err) {
      console.error('Generation failed:', err);
      alert('Failed to generate combinations.');
    } finally {
      setGenerating(false);
    }
  };

  const handleClearPending = async () => {
    if (!confirm('Are you sure you want to delete all pending comparisons?')) return;
    try {
      setLoading(true);
      await comparisonService.clearPendingComparisons();
      await loadData();
      alert('All pending comparisons have been cleared.');
    } catch (err: any) {
      console.error('Clear failed:', err);
      alert(`Failed to clear pending comparisons: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (id: string) => {
    try {
      await comparisonService.generateAIContent(id);
      await loadData();
    } catch (err) {
      console.error('AI generation failed:', err);
      alert('Failed to generate AI content.');
    }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'generated' : 'published';
    try {
      await comparisonService.updateComparison(id, { status: newStatus as any });
      await loadData();
    } catch (err) {
      console.error('Publish failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comparison?')) return;
    try {
      await comparisonService.deleteComparison(id);
      setComparisons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const startEditing = (comp: ProgrammaticComparison) => {
    setEditingId(comp.id);
    setEditForm({
      seo_title: comp.seo_title,
      seo_description: comp.seo_description,
      slug: comp.slug
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await comparisonService.updateComparison(editingId, editForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes.');
    }
  };

  const filteredComparisons = comparisons.filter(c => {
    const matchesSearch = c.slug.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.tool1?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.tool2?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Programmatic SEO">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">SEO Engine</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage automated tool comparison pages and SEO content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearPending}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black rounded-xl hover:bg-rose-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear Pending
          </button>
          <button 
            onClick={handleGenerateCombinations}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate Combinations
          </button>
          <button onClick={loadData} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Pages', value: comparisons.length, icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Published', value: comparisons.filter(c => c.status === 'published').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Generated', value: comparisons.filter(c => c.status === 'generated').length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending', value: comparisons.filter(c => c.status === 'pending').length, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} dark:bg-opacity-10 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search comparisons..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl outline-none dark:text-white font-bold"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="generated">Generated</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest border-b dark:border-slate-800">Comparison</th>
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest border-b dark:border-slate-800">Status</th>
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest border-b dark:border-slate-800">SEO Health</th>
                <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-widest border-b dark:border-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredComparisons.map((comp) => (
                  <motion.tr 
                    key={comp.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b dark:border-slate-800 last:border-0"
                  >
                    <td className="p-6">
                      {editingId === comp.id ? (
                        <div className="space-y-3 min-w-[300px]">
                          <input 
                            type="text" 
                            value={editForm.slug} 
                            onChange={e => setEditForm({...editForm, slug: e.target.value})}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm"
                          />
                          <input 
                            type="text" 
                            value={editForm.seo_title} 
                            onChange={e => setEditForm({...editForm, seo_title: e.target.value})}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm"
                            placeholder="SEO Title"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-3">
                            <img src={comp.tool1?.logoUrl} className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 object-cover" alt="" />
                            <img src={comp.tool2?.logoUrl} className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 object-cover" alt="" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-white">{comp.tool1?.name} vs {comp.tool2?.name}</div>
                            <div className="text-xs text-slate-500 font-mono">/compare/{comp.slug}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${comp.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          comp.status === 'generated' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
                      >
                        {comp.status === 'published' && <CheckCircle className="w-3 h-3" />}
                        {comp.status === 'generated' && <FileText className="w-3 h-3" />}
                        {comp.status === 'pending' && <Clock className="w-3 h-3" />}
                        {comp.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${comp.seo_title ? 'bg-emerald-500' : 'bg-slate-300'}`} title="SEO Title"></div>
                        <div className={`w-2 h-2 rounded-full ${comp.seo_description ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Meta Description"></div>
                        <div className={`w-2 h-2 rounded-full ${comp.faq_schema ? 'bg-emerald-500' : 'bg-slate-300'}`} title="FAQ Schema"></div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {editingId === comp.id ? (
                          <>
                            <button onClick={saveEdit} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg hover:bg-slate-200 transition-all">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {comp.status === 'pending' ? (
                              <button 
                                onClick={() => handleGenerateContent(comp.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-all"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Generate AI
                              </button>
                            ) : (
                              <button 
                                onClick={() => handlePublish(comp.id, comp.status)}
                                className={`flex items-center gap-2 px-3 py-1.5 font-bold text-xs rounded-lg transition-all
                                  ${comp.status === 'published' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                              >
                                {comp.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>
                            )}
                            <button onClick={() => startEditing(comp)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(comp.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredComparisons.length === 0 && (
          <div className="p-20 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No comparisons found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProgrammaticSEO;
