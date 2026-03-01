
import React from 'react';
import { Category } from '../types';

interface FiltersProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPricing: string;
  setSelectedPricing: (price: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPricing,
  setSelectedPricing,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="space-y-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Categories</h4>
        <div className="space-y-1">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.name ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Pricing Model</h4>
        <div className="flex flex-wrap gap-2">
          {['all', 'Free', 'Freemium', 'Paid'].map(price => (
            <button 
              key={price}
              onClick={() => setSelectedPricing(price)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedPricing === price ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'}`}
            >
              {price === 'all' ? 'All' : price}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Sort By</h4>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest Added</option>
          <option value="rating">Highest Rated</option>
          <option value="az">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
