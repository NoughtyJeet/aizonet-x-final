
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { AITool } from '../../types';
import { supabaseService } from '../../services/supabaseService';

const AdminSubmissions: React.FC = () => {
  const [subs, setSubs] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const tools = await supabaseService.getTools();
      setSubs(tools.filter(t => t.status === 'pending'));
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'active' | 'rejected') => {
    const target = subs.find(s => s.id === id);
    if (!target) return;

    try {
      if (action === 'active') {
        // Approve: Update status to active
        await supabaseService.upsertTool({ 
          ...target, 
          status: 'active', 
          isFeatured: false, 
          isTrending: false,
          rating: 4.5,
          reviewCount: 1,
          createdAt: new Date().toISOString().split('T')[0]
        });
        alert(`Tool "${target.name}" Approved and published successfully!`);
      } else {
        // Reject: Update status to rejected
        await supabaseService.upsertTool({ ...target, status: 'rejected' });
        alert(`Tool "${target.name}" has been rejected.`);
      }
      loadSubmissions();
    } catch (err) {
      console.error('Failed to process submission:', err);
      alert('Failed to process submission.');
    }
  };

  return (
    <AdminLayout title="User Submissions">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 shadow-sm overflow-hidden">
        {subs.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                <th className="p-6 font-black uppercase text-[10px] text-slate-400">Submitted Tool</th>
                <th className="p-6 font-black uppercase text-[10px] text-slate-400">Details</th>
                <th className="p-6 font-black uppercase text-[10px] text-slate-400 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {subs.map(sub => (
                <tr key={sub.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={sub.logoUrl} className="h-12 w-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800" alt={sub.name} />
                      <div>
                        <h4 className="font-bold dark:text-white">{sub.name}</h4>
                        <a href={sub.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                          Visit Site
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 max-w-sm">
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{sub.description}</p>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded uppercase text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">{sub.category}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded uppercase text-slate-500">{sub.pricing}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(sub.id, 'active')} 
                        className="bg-indigo-600 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(sub.id, 'rejected')} 
                        className="bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black px-4 py-2 rounded-xl text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-xl font-black mb-2 dark:text-white">Inbox Zero!</h3>
            <p className="text-slate-500">No new tool submissions to review right now.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
