
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  openSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, openSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Discover Tools', path: '/tools' },
    { name: 'Categories', path: '/categories' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              <span className="bg-indigo-600 p-1 rounded text-white text-xs">AI</span>
              <span>AIZONET</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                    isActive(link.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              )}
            </button>

            <Link to="/admin/login" className="hidden lg:flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Admin Portal">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLogout}
                  className="hidden sm:inline-flex text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700">
                  Join Free
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-slate-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-600 dark:text-slate-300"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t dark:border-slate-800 space-y-2">
             {user ? (
               <>
                 <div className="flex items-center gap-3 px-2 py-2">
                   <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                     {user.email?.[0].toUpperCase()}
                   </div>
                   <span className="text-sm font-medium dark:text-white truncate">{user.email}</span>
                 </div>
                 <button 
                   onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}}
                   className="block w-full text-left px-2 py-2 text-sm font-bold text-red-500"
                 >
                   Logout
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                   Login
                 </Link>
                 <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center rounded-lg bg-indigo-600 py-2 text-white font-bold">
                   Join Free
                 </Link>
               </>
             )}
             <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
               Admin Portal
             </Link>
          </div>
          <Link to="/submit-tool" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center rounded-lg border-2 border-indigo-600 py-2 text-indigo-600 font-bold">
            Submit Tool
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
