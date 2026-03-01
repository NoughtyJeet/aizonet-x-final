
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { supabaseService } from '../../services/supabaseService';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/#/admin/dashboard'
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check role
      const role = await supabaseService.getCurrentUserRole();
      if (role !== 'Admin') {
        await supabase.auth.signOut();
        throw new Error('Access Denied: You do not have administrator privileges.');
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.15)_0%,rgba(15,23,42,0)_100%)]" />
      
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all mb-8 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to AIZONET Site</span>
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 text-3xl font-black text-indigo-400 mb-4">
            <span className="bg-indigo-600 p-1.5 rounded text-white text-xs">AI</span>
            <span>AIZONET</span>
          </div>
          <h1 className="text-white text-2xl font-black">Management Portal</h1>
          <p className="text-slate-400 mt-2">Sign in to manage the directory</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aizonet.in" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-600 transition-colors"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Authenticate & Enter'}
            </button>

            <div className="relative my-8 text-center">
              <hr className="border-slate-800" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">or use google</span>
            </div>

            <div className="flex justify-center">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center gap-3 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-all"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Sign in with Google
              </button>
            </div>
          </form>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">Security notice: unauthorized access attempts are logged.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
