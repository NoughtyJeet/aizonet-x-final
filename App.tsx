
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import ToolDetail from './pages/ToolDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SubmitTool from './pages/SubmitTool';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTools from './pages/admin/Tools';
import AdminSubmissions from './pages/admin/Submissions';
import AdminBlog from './pages/admin/Blog';
import AdminSettings from './pages/admin/Settings';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminProgrammaticSEO from './pages/admin/ProgrammaticSEO';
import ComparisonDetail from './pages/ComparisonDetail';
import AdSlot from './components/AdSlot';
import Chatbot from './components/Chatbot';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { Theme, SiteSettings, AITool, Category } from './types';
import { MOCK_TOOLS, INITIAL_SITE_SETTINGS, CATEGORIES, MOCK_POSTS } from './constants';
import { supabaseService } from './services/supabaseService';
import { supabase } from './supabase';

const ProtectedRoute = ({ children, requiredRole }: { children?: React.ReactNode, requiredRole?: 'Admin' | 'User' }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'Admin' | 'User' | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const role = await supabaseService.getCurrentUserRole();
      setUserRole(role);
      setAuthenticated(true);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
  
  if (!authenticated) {
    return <Navigate to={requiredRole === 'Admin' ? "/admin/login" : "/login"} />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const CategoriesPage = () => {
  const [cats, setCats] = useState<Category[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tools, categories] = await Promise.all([
          supabaseService.getTools(),
          supabaseService.getCategories()
        ]);
        const updatedCats = categories.map((cat: Category) => ({
          ...cat,
          count: tools.filter((t: AITool) => t.category === cat.name).length
        }));
        setCats(updatedCats);
      } catch (err) {
        console.error('Failed to load categories:', err);
        // Fallback to constants if supabase fails
        setCats(CATEGORIES);
      }
    };
    loadData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
          Explore by <span className="text-indigo-600 dark:text-indigo-400">Category</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          We've meticulously organized the world's best AI tools into specialized categories to help you find exactly what you need in 2026.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
        {cats.map(cat => (
          <Link 
            key={cat.id} 
            to={`/tools?category=${encodeURIComponent(cat.name)}`}
            className="group relative p-8 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] text-center hover:border-indigo-600 dark:hover:border-indigo-400 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-600/10 hover:-translate-y-2"
          >
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500 ease-out drop-shadow-sm">{cat.icon}</div>
            <h3 className="font-black text-slate-900 dark:text-white mb-2 text-lg leading-tight">{cat.name}</h3>
            <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {cat.count} Tools
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const accept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[200] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍪</span>
          <h4 className="font-black dark:text-white">Cookie Preferences</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          We use cookies to enhance your experience. By clicking "Accept", you consent to our use of cookies.
        </p>
        <div className="flex gap-2 mt-2">
          <button onClick={accept} className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-xl text-xs hover:bg-indigo-700 transition-all">Accept All</button>
          <button onClick={() => setVisible(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-3 rounded-xl text-xs hover:bg-slate-200 transition-all">Essential Only</button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced SEO and Analytics Injection logic
  const injectSEOTags = async () => {
    try {
      const settings = await supabaseService.getSettings() || INITIAL_SITE_SETTINGS;
      const seo = settings.seo;

    // Dynamic Link Tag for Canonical (Crucial for avoiding property mismatch)
    const upsertLink = (rel: string, href: string) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const upsertMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Canonical Tag Injection (Fixes GSC property issues)
    if (seo.siteUrl) {
      upsertLink('canonical', seo.siteUrl);
    }

    // Dynamic Verification Tags
    upsertMeta('google-site-verification', seo.googleSearchConsoleId);
    upsertMeta('msvalidate.01', seo.bingVerification);
    upsertMeta('yandex-verification', seo.yandexVerification);
    upsertMeta('baidu-site-verification', seo.baiduVerification);
    upsertMeta('p:domain_verify', seo.pinterestVerification);
    upsertMeta('facebook-domain-verification', seo.facebookDomainVerification);

    // Google Analytics Integration
    if (seo.googleAnalyticsId && !(window as any).gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${seo.googleAnalyticsId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // Google AdSense Identification
    if (settings.ads.adSenseClientId) {
      upsertMeta('google-adsense-account', settings.ads.adSenseClientId);
    }
    } catch (err) {
      console.error('Failed to inject SEO tags:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await supabaseService.seedInitialData();
      injectSEOTags();
    };
    
    init();

    window.addEventListener('settingsUpdated', injectSEOTags);
    return () => window.removeEventListener('settingsUpdated', injectSEOTags);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const [currentTools, setCurrentTools] = useState<AITool[]>([]);
  useEffect(() => {
    const loadTools = async () => {
      try {
        const tools = await supabaseService.getTools();
        setCurrentTools(tools);
      } catch (err) {
        console.error('Failed to load tools for search:', err);
        setCurrentTools(MOCK_TOOLS);
      }
    };
    loadTools();
  }, []);

  const searchResults = searchQuery.length > 1 
    ? currentTools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col transition-colors duration-300">
          <Routes>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/tools" element={<ProtectedRoute requiredRole="Admin"><AdminTools /></ProtectedRoute>} />
            <Route path="/admin/submissions" element={<ProtectedRoute requiredRole="Admin"><AdminSubmissions /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute requiredRole="Admin"><AdminBlog /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="Admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/seo" element={<ProtectedRoute requiredRole="Admin"><AdminProgrammaticSEO /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="Admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute requiredRole="Admin"><AdminCategories /></ProtectedRoute>} />
            
            <Route path="*" element={
              <>
                <div className="sticky top-0 z-50">
                   <AdSlot placement="header" className="bg-white dark:bg-slate-900 border-b dark:border-slate-800" />
                   <Header theme={theme} toggleTheme={toggleTheme} openSearch={() => setIsSearchOpen(true)} />
                </div>
                <main className="flex-grow dark:bg-slate-950 bg-white">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/tools/:slug" element={<ToolDetail />} />
                    <Route path="/compare/:slug" element={<ComparisonDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/submit-tool" element={<SubmitTool />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                  </Routes>
                </main>
                <AdSlot placement="footer" className="mt-20 border-t dark:border-slate-800 pt-10 pb-10" />
                <Footer />
                <Chatbot />
              </>
            } />
          </Routes>
  
          <CookieConsent />
          <SpeedInsights />
  
          {isSearchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-md px-4" onClick={() => {setIsSearchOpen(false); setSearchQuery('');}}>
              <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center border-b-2 dark:border-slate-700 p-6">
                  <svg className="w-6 h-6 text-slate-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    autoFocus
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 5,000+ AI tools..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-medium dark:text-white placeholder-slate-400"
                  />
                  <button onClick={() => {setIsSearchOpen(false); setSearchQuery('');}} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-4">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4">Top Suggestions</h5>
                      <div className="space-y-1">
                        {searchResults.map(tool => (
                          <Link key={tool.id} to={`/tools/${tool.slug}`} onClick={() => {setIsSearchOpen(false); setSearchQuery('');}} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors group">
                            <img src={tool.logoUrl} className="h-10 w-10 rounded-lg object-cover" alt={tool.name} />
                            <div className="flex-1">
                               <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{tool.name}</div>
                               <div className="text-xs text-slate-500 dark:text-slate-400">{tool.category}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">Search for tools to see results</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
