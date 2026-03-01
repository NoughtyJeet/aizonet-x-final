
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { supabaseService } from '../../services/supabaseService';

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center text-2xl`}>{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-black mt-1 dark:text-white">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ tools: 0, posts: 0, subs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [tools, posts] = await Promise.all([
          supabaseService.getTools(),
          supabaseService.getPosts()
        ]);
        
        const activeTools = tools.filter(t => t.status === 'active' || !t.status);
        const pendingSubs = tools.filter(t => t.status === 'pending');
        
        setStats({ 
          tools: activeTools.length, 
          posts: posts.length, 
          subs: pendingSubs.length 
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <AdminLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tools" value={stats.tools.toLocaleString()} change="+5.2%" icon="🛠️" color="bg-blue-100 dark:bg-blue-900/30" />
        <StatCard title="Blog Posts" value={stats.posts.toLocaleString()} change="+1.2%" icon="✍️" color="bg-purple-100 dark:bg-purple-900/30" />
        <StatCard title="Submissions" value={stats.subs.toLocaleString()} change={stats.subs > 0 ? "+100%" : "0%"} icon="📥" color="bg-amber-100 dark:bg-amber-900/30" />
        <StatCard title="Monthly Views" value="12.4K" change="+8.1%" icon="👁️" color="bg-indigo-100 dark:bg-indigo-900/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/admin/tools" className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border dark:border-slate-700">
                <span className="text-2xl mb-2 block">➕</span>
                <span className="font-bold text-xs">Add Tool</span>
              </Link>
              <Link to="/admin/categories" className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border dark:border-slate-700">
                <span className="text-2xl mb-2 block">🏷️</span>
                <span className="font-bold text-xs">Manage Cats</span>
              </Link>
              <Link to="/admin/blog" className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border dark:border-slate-700">
                <span className="text-2xl mb-2 block">📝</span>
                <span className="font-bold text-xs">Write Blog</span>
              </Link>
              <Link to="/admin/seo" className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border dark:border-slate-700">
                <span className="text-2xl mb-2 block">📈</span>
                <span className="font-bold text-xs">SEO Engine</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 dark:text-white">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Database State</span>
                <span className="flex items-center gap-2 font-bold text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                  Supabase Cloud
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Gemini AI</span>
                <span className="flex items-center gap-2 font-bold text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  v3 Flash Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
