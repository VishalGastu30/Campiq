'use client';

import { useState, useEffect, useRef } from 'react';
import { useCompare } from '@/context/CompareContext';
import { api } from '@/lib/api';
import { College } from '@/types';
import { Search, X, Check } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface CollegeSelectorProps {
  selectedCollege: College | null;
  onSelect: (college: College) => void;
  onRemove: () => void;
  index: number;
}

export function CollegeSelector({ selectedCollege, onSelect, onRemove, index }: CollegeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { compareIds } = useCompare();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      if (!isOpen) return;
      setIsLoading(true);
      try {
        const res = await api.colleges.getAll({ search: debouncedQuery, limit: 10 });
        setResults(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, isOpen]);

  if (selectedCollege) {
    return (
      <div className="relative flex flex-col h-full min-h-[200px] p-6 rounded-2xl bg-campiq-surface border border-campiq-teal shadow-[0_0_15px_rgba(0,212,160,0.1)] transition-all">
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-campiq-raised text-campiq-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Remove from comparison"
        >
          <X size={16} />
        </button>
        
        <div className="flex flex-col items-center text-center mt-4 mb-4">
          <div className="h-20 w-20 rounded-2xl bg-campiq-raised border-2 border-campiq-base shadow-lg flex items-center justify-center text-2xl font-bold text-campiq-teal mb-4">
            {getInitials(selectedCollege.name)}
          </div>
          <h3 className="font-bold text-campiq-text-primary text-lg leading-tight line-clamp-2">{selectedCollege.name}</h3>
          <p className="text-sm text-campiq-text-muted mt-2">{selectedCollege.location}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={dropdownRef}
      className="relative flex flex-col items-center justify-center h-full min-h-[200px] p-6 rounded-2xl border border-dashed border-campiq-border bg-campiq-surface/50 hover:bg-campiq-surface transition-colors"
    >
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-campiq-text-muted hover:text-campiq-teal transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-campiq-raised flex items-center justify-center mb-4 border border-campiq-border">
            <span className="text-2xl font-light">+</span>
          </div>
          <span className="font-medium text-sm">Add College {index + 1}</span>
        </button>
      ) : (
        <div className="absolute inset-0 z-20 bg-campiq-surface rounded-2xl border border-campiq-border shadow-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-campiq-border flex items-center gap-2">
            <Search size={18} className="text-campiq-text-muted" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search college..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-campiq-text-primary placeholder:text-campiq-text-muted"
            />
            <button onClick={() => setIsOpen(false)} className="text-campiq-text-muted hover:text-campiq-text-primary">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-campiq-text-muted">Loading...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-sm text-campiq-text-muted">No colleges found</div>
            ) : (
              results.map(college => {
                const isAlreadySelected = compareIds.includes(college.id);
                return (
                  <button
                    key={college.id}
                    onClick={() => {
                      if (!isAlreadySelected) {
                        onSelect(college);
                        setIsOpen(false);
                        setQuery('');
                      }
                    }}
                    disabled={isAlreadySelected}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      isAlreadySelected 
                        ? "opacity-50 cursor-not-allowed bg-campiq-raised/50" 
                        : "hover:bg-campiq-raised focus:bg-campiq-raised outline-none"
                    )}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-campiq-base border border-campiq-border flex items-center justify-center text-xs font-bold text-campiq-teal">
                      {getInitials(college.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-campiq-text-primary truncate">{college.name}</p>
                      <p className="text-xs text-campiq-text-muted truncate">{college.location}</p>
                    </div>
                    {isAlreadySelected && <Check size={16} className="text-campiq-teal shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
