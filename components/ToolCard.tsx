
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AITool } from '../types';
import { useCompare } from './CompareContext';

interface ToolCardProps {
  tool: AITool;
  showCompare?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, showCompare = false }) => {
  const [isCopied, setIsCopied] = useState(false);
  const compareContext = showCompare ? useCompare() : null;

  const isSelected = compareContext?.selectedTools.some(t => t.id === tool.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!compareContext) return;

    if (isSelected) {
      compareContext.removeFromCompare(tool.id);
    } else {
      if (compareContext.selectedTools.length >= 3) {
        // Show notification (we'll use a simple alert for now, or better UI later)
        alert('You can only compare up to 3 tools.');
        return;
      }
      compareContext.addToCompare(tool);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Construct the correct absolute URL for the tool (handling HashRouter)
    const shareUrl = `${window.location.origin}/#/tools/${tool.slug}`;
    
    const shareData = {
      title: `${tool.name} | AIZONET Directory 2026`,
      text: tool.description,
      url: shareUrl,
    };

    try {
      if (navigator.share && (typeof navigator.canShare !== 'function' || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not available');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (clipErr) {
          console.error('Clipboard copy failed:', clipErr);
        }
      }
    }
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/tools/${tool.slug}`} className="p-5 flex-grow">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative h-14 w-14 flex-shrink-0">
            <img 
              src={tool.logoUrl} 
              alt={tool.name} 
              className="h-full w-full rounded-xl object-cover shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                tool.pricing === 'Free' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                tool.pricing === 'Freemium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {tool.pricing}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-0.5">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{tool.rating.toFixed(1)}</span>
              </span>
              <span>•</span>
              <span className="truncate">{tool.category}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      </Link>
      
      <div className="px-5 py-4 border-t dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          {showCompare && (
            <button 
              onClick={handleCompareToggle}
              className={`flex items-center gap-1.5 transition-all duration-300 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              title={isSelected ? "Remove from compare" : "Add to compare"}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-black uppercase">Compare</span>
            </button>
          )}
          <Link 
            to={`/tools/${tool.slug}`}
            className="text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-tight"
          >
            Details
          </Link>
          <button 
            onClick={handleShare}
            className={`flex items-center gap-1.5 transition-all duration-300 ${isCopied ? 'text-green-600 dark:text-green-400' : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            title="Share tool"
          >
            {isCopied ? (
              <span className="text-[10px] font-black uppercase">Copied!</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>
        <a 
          href={tool.websiteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          Visit Site
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </div>
  );
};

export default ToolCard;
