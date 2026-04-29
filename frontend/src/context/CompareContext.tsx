'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface CompareContextType {
  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFromStorage = () => {
      const stored = localStorage.getItem('campiq_compare');
      if (stored) {
        try {
          setCompareIds(JSON.parse(stored));
        } catch (e) {}
      }
    };
    
    loadFromStorage();
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'campiq_compare') {
        loadFromStorage();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveToStorage = (ids: string[]) => {
    setCompareIds(ids);
    localStorage.setItem('campiq_compare', JSON.stringify(ids));
  };

  const addToCompare = (id: string) => {
    if (compareIds.includes(id)) return;
    if (compareIds.length >= 3) {
      toast.error('You can only compare up to 3 colleges');
      return;
    }
    saveToStorage([...compareIds, id]);
    toast.success('Added to compare');
  };

  const removeFromCompare = (id: string) => {
    saveToStorage(compareIds.filter(cid => cid !== id));
  };

  const clearCompare = () => {
    saveToStorage([]);
  };

  const isInCompare = (id: string) => {
    return compareIds.includes(id);
  };

  return (
    <CompareContext.Provider value={{ compareIds, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
