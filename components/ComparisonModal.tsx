
import React, { useEffect, useState } from 'react';
import { useCompare } from './CompareContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Check, ExternalLink, Info } from 'lucide-react';
import { AITool } from '../types';

const ComparisonModal: React.FC = () => {
  const { selectedTools, isComparing, setIsComparing, clearCompare } = useCompare();
  const [tools, setTools] = useState<AITool[]>([]);

  useEffect(() => {
    if (isComparing) {
      // In a real app, we might fetch fresh data here for the selected IDs
      // to ensure we have the most up-to-date pros/cons/features.
      // For now, we use the tools from the context.
      setTools(selectedTools);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isComparing, selectedTools]);

  if (!isComparing) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={() => setIsComparing(false)}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tool Comparison</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Comparing {tools.length} selected AI tools side-by-side.</p>
            </div>
            <button 
              onClick={() => setIsComparing(false)}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <div className="min-w-[800px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-1/4 p-4 text-left font-black text-slate-400 uppercase text-xs tracking-widest">Features</th>
                    {tools.map((tool) => (
                      <th key={tool.id} className="w-1/4 p-4 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <img 
                            src={tool.logoUrl} 
                            alt={tool.name} 
                            className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-slate-50 dark:border-slate-800"
                          />
                          <h3 className="font-black text-slate-900 dark:text-white text-lg">{tool.name}</h3>
                          <a 
                            href={tool.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                          >
                            Visit Site
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {/* Pricing */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Pricing Model</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tool.pricing === 'Free' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          tool.pricing === 'Freemium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {tool.pricing}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">User Rating</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-black text-slate-900 dark:text-white">{tool.rating.toFixed(1)}</span>
                          <span className="text-xs text-slate-400">({tool.reviewCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Category</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6 text-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.category}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Key Features */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Key Features</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6">
                        <div className="flex flex-col gap-2">
                          {tool.features.slice(0, 8).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <Check className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Pros & Cons */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Pros & Cons</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6">
                        <div className="space-y-4">
                          {tool.pros && tool.pros.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pros</p>
                              {tool.pros.slice(0, 3).map((pro, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                  <span className="text-emerald-500">✔</span>
                                  <span>{pro}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {tool.cons && tool.cons.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Cons</p>
                              {tool.cons.slice(0, 2).map((con, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                  <span className="text-rose-500">!</span>
                                  <span>{con}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {(!tool.pros || tool.pros.length === 0) && (!tool.cons || tool.cons.length === 0) && (
                            <p className="text-[11px] text-slate-400 italic">No detailed analysis available.</p>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Overview</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6">
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                          {tool.description}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Target Audience */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Target Audience</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6 text-center">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {tool.targetAudience || 'General Users'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Use Cases */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Best Use Cases</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6">
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {tool.useCases?.map((useCase, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400">
                              {useCase}
                            </span>
                          )) || <span className="text-[10px] text-slate-400 italic">Not specified</span>}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Integrations */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Integrations</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6">
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {tool.integrations?.map((integration, idx) => (
                            <span key={idx} className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400">
                              {integration}
                            </span>
                          )) || <span className="text-[10px] text-slate-400 italic">Standalone</span>}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* API & Mobile */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Availability</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6">
                        <div className="flex flex-col gap-2 items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">API:</span>
                            {tool.apiAvailable ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Mobile:</span>
                            {tool.mobileApp ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Support */}
                  <tr>
                    <td className="p-6 font-bold text-slate-500 dark:text-slate-400">Support</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-6 text-center">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {tool.supportType || 'Email / Documentation'}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 md:p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Info className="w-4 h-4" />
              <span>Comparison data is based on current directory listings.</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={clearCompare}
                className="px-6 py-3 text-slate-500 font-bold hover:text-red-500 transition-colors"
              >
                Clear Selections
              </button>
              <button 
                onClick={() => setIsComparing(false)}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:scale-105 transition-all"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
