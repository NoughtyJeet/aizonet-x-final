
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import Filters from '../components/Filters';
import AdSlot from '../components/AdSlot';
import { AITool, Category } from '../types';
import { supabaseService } from '../services/supabaseService';
import { MOCK_TOOLS, CATEGORIES } from '../constants';
import { CompareProvider } from '../components/CompareContext';
import FloatingCompareBar from '../components/FloatingCompareBar';
import ComparisonModal from '../components/ComparisonModal';

const ToolsContent: React.FC = () => {
  const location = useLocation();
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tools and categories from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [toolsData, catsData] = await Promise.all([
          supabaseService.getTools(),
          supabaseService.getCategories()
        ]);
        setTools(toolsData.filter(t => t.status === 'active' || !t.status));
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load tools data:', err);
        setTools(MOCK_TOOLS);
        setCategories(CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Parse category from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const filteredTools = useMemo(() => {
    let result = [...tools];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (selectedPricing !== 'all') {
      result = result.filter(t => t.pricing === selectedPricing);
    }

    result.sort((a, b) => {
      if (sortBy === 'popular') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [tools, searchQuery, selectedCategory, selectedPricing, sortBy]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Discovery Directory</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Search and browse through our curated collection of over {tools.length}+ AI tools. 
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block space-y-8">
          <Filters 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPricing={selectedPricing}
            setSelectedPricing={setSelectedPricing}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </aside>

        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search tools by name, features or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-12 py-4 text-lg outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden bg-indigo-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg">Filters</button>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTools.map((tool, idx) => (
                <React.Fragment key={tool.id}>
                  <ToolCard tool={tool} showCompare={true} />
                  {idx === 1 && <AdSlot placement="toolDirectory" className="md:col-span-2" />}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border-2 border-dashed dark:border-slate-800">
              <h3 className="text-xl font-bold">No tools found</h3>
              <button onClick={() => {setSearchQuery(''); setSelectedCategory('all'); setSelectedPricing('all');}} className="mt-4 text-indigo-600 font-bold">Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 p-8 shadow-2xl animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black dark:text-white">Filters</h3>
               <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">&times;</button>
             </div>
             <Filters 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => {setSelectedCategory(c); setIsSidebarOpen(false);}}
              selectedPricing={selectedPricing}
              setSelectedPricing={(p) => {setSelectedPricing(p); setIsSidebarOpen(false);}}
              sortBy={sortBy}
              setSortBy={(s) => {setSortBy(s); setIsSidebarOpen(false);}}
            />
          </div>
        </div>
      )}

      <FloatingCompareBar />
      <ComparisonModal />
    </div>
  );
};

const Tools: React.FC = () => {
  return (
    <CompareProvider>
      <ToolsContent />
    </CompareProvider>
  );
};

export default Tools;
