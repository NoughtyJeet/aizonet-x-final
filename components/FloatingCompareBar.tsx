
import React from 'react';
import { useCompare } from './CompareContext';
import { motion, AnimatePresence } from 'motion/react';

const FloatingCompareBar: React.FC = () => {
  const { selectedTools, removeFromCompare, clearCompare, setIsComparing } = useCompare();

  if (selectedTools.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-2xl px-4"
      >
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {selectedTools.map((tool) => (
              <div key={tool.id} className="relative group flex-shrink-0">
                <img 
                  src={tool.logoUrl} 
                  alt={tool.name} 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100 dark:border-slate-800"
                />
                <button 
                  onClick={() => removeFromCompare(tool.id)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
            {selectedTools.length < 3 && (
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300">
                <span className="text-xs font-bold">{selectedTools.length}/3</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={clearCompare}
              className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-tight transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={() => setIsComparing(true)}
              disabled={selectedTools.length < 2}
              className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${
                selectedTools.length >= 2 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-95' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Compare {selectedTools.length} Tools
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCompareBar;
