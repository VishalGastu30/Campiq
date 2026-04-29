'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCompare } from '@/context/CompareContext';
import { api } from '@/lib/api';
import { College } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';
import { X, ArrowRight } from 'lucide-react';

export function FloatingCompareBar() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const [colleges, setColleges] = useState<College[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  // Hide on the compare page itself
  const isComparePage = pathname === '/compare';
  const shouldShow = compareIds.length > 0 && !isComparePage;

  useEffect(() => {
    if (compareIds.length > 0) {
      api.colleges.getCompare(compareIds).then(setColleges);
    } else {
      setColleges([]);
    }
  }, [compareIds]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-0 inset-x-0 z-40 p-4 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-campiq-surface/95 backdrop-blur-xl border border-campiq-border rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] p-4 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div>
                <p className="text-sm font-bold text-campiq-text-primary">Compare Colleges</p>
                <p className="text-xs text-campiq-text-secondary">{compareIds.length}/3 selected</p>
              </div>
              
              <div className="flex items-center gap-2 border-l border-campiq-border pl-4">
                {colleges.map((college) => (
                  <div key={college.id} className="relative group">
                    <div className="w-10 h-10 rounded-lg bg-campiq-raised border border-campiq-border flex items-center justify-center text-xs font-bold text-campiq-teal shadow-sm">
                      {getInitials(college.name)}
                    </div>
                    <button 
                      onClick={() => removeFromCompare(college.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X size={10} />
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-campiq-raised text-xs text-campiq-text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {college.name}
                    </div>
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: 3 - compareIds.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-10 h-10 rounded-lg border border-dashed border-campiq-border bg-campiq-base/50 flex items-center justify-center text-campiq-text-muted">
                    +
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
              <Button variant="ghost" size="sm" onClick={clearCompare} className="text-campiq-text-secondary hover:text-red-400 hover:bg-red-400/10">
                Clear all
              </Button>
              <Button 
                onClick={() => router.push('/compare')}
                disabled={compareIds.length < 2}
                className="w-full md:w-auto"
              >
                Compare Now {compareIds.length < 2 && '(Select 2+)'}
                {compareIds.length >= 2 && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
