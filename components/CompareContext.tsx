
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AITool } from '../types';

interface CompareContextType {
  selectedTools: AITool[];
  addToCompare: (tool: AITool) => void;
  removeFromCompare: (toolId: string) => void;
  clearCompare: () => void;
  isComparing: boolean;
  setIsComparing: (val: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const addToCompare = useCallback((tool: AITool) => {
    setSelectedTools((prev) => {
      if (prev.find((t) => t.id === tool.id)) return prev;
      if (prev.length >= 3) {
        // We'll handle the notification in the UI
        return prev;
      }
      return [...prev, tool];
    });
  }, []);

  const removeFromCompare = useCallback((toolId: string) => {
    setSelectedTools((prev) => prev.filter((t) => t.id !== toolId));
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedTools([]);
    setIsComparing(false);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        selectedTools,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        setIsComparing,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
