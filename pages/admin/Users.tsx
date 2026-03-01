
import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { supabaseService } from '../../services/supabaseService';

interface SiteUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  registrationDate: string;
  picture?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'User'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getProfiles();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        // Seed initial users if none exist in profiles table
        const initialUsers: SiteUser[] = [
          { id: '1', name: 'Super Admin', email: 'admin@aizonet.in', role: 'Admin', registrationDate: '2026-01-01' },
          { id: '2', name: 'Jeet Parganiha', email: 'jeet@aizonet.in', role: 'Admin', registrationDate: '2026-02-15' },
          { id: '3', name: 'Test User', email: 'user@example.com', role: 'User', registrationDate: '2026-05-20' },
        ];
        for (const user of initialUsers) {
          await supabaseService.upsertProfile(user);
        }
        setUsers(initialUsers);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Security Alert: Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await supabaseService.deleteProfile(id);
        loadUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const toggleRole = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      const updatedUser = { ...user, role: user.role === 'Admin' ? 'User' : 'Admin' } as SiteUser;
      await supabaseService.upsertProfile(updatedUser);
      loadUsers();
    } catch (err) {
      console.error('Failed to toggle role:', err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <AdminLayout title="User Management">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filter Role:</span>
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-1 rounded-xl flex gap-1">
            {(['All', 'Admin', 'User'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  roleFilter === role 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-6 font-black uppercase text-[10px] text-slate-400">User Identity</th>
                <th className="p-6 font-black uppercase text-[10px] text-slate-400">Current Role</th>
                <th className="p-6 font-black uppercase text-[10px] text-slate-400">Joined Date</th>
                <th className="p-6 font-black uppercase text-[10px] text-slate-400 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-slate-500">{user.registrationDate}</p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleRole(user.id)}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          Change Role
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm"
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-slate-500 font-bold">No users match your current criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-4 p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/40">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">⚠️</div>
        <p className="text-xs text-indigo-900 dark:text-indigo-300 font-medium leading-relaxed">
          <strong>System Protocol:</strong> User management actions are permanent. Role changes grant or revoke access to administrative features across the AIZONET ecosystem.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
