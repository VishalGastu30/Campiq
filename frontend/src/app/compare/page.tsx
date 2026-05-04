'use client';

import { Suspense, useState, useEffect } from 'react';
import { useCompare } from '@/context/CompareContext';
import { api } from '@/lib/api';
import { College } from '@/types';
import { CollegeSelector } from '@/components/compare/CollegeSelector';
import { CompareTable } from '@/components/compare/CompareTable';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { SearchX, LayoutGrid, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CompareContent() {
  const { compareIds, removeFromCompare, addToCompare, setCompareIdsBulk } = useCompare();
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Sync from URL to context on mount
  useEffect(() => {
    const urlColleges = searchParams.get('colleges');
    if (urlColleges) {
      const ids = urlColleges.split(',').filter(Boolean);
      if (ids.length > 0) {
        setCompareIdsBulk(ids);
      }
    }
    // Small delay to allow context state to update before we start syncing back to URL
    setTimeout(() => setIsInitialized(true), 100);
  }, []);

  // Sync from context to URL
  useEffect(() => {
    if (!isInitialized) return; // Don't wipe URL before we've read it!
    
    if (compareIds.length > 0) {
      router.replace(`/compare?colleges=${compareIds.join(',')}`, { scroll: false });
    } else {
      router.replace(`/compare`, { scroll: false });
    }
  }, [compareIds, router, isInitialized]);

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      if (compareIds.length > 0) {
        try {
          const res = await api.colleges.getCompare(compareIds);
          // Sort them in the order of compareIds
          setColleges(compareIds.map(id => res.find(c => c.id === id)!).filter(Boolean));
        } catch (e) {
          console.error(e);
        }
      } else {
        setColleges([]);
      }
      setIsLoading(false);
    };
    
    fetchColleges();
  }, [compareIds]);

  const handleShare = () => {
    const url = `${window.location.origin}/compare?colleges=${compareIds.join(',')}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelect = (college: College, index: number) => {
    addToCompare(college.id);
  };

  const handleRemove = (id: string) => {
    removeFromCompare(id);
  };

  // Create array of exactly 3 items (either college or null)
  const slots = Array.from({ length: 3 }).map((_, i) => colleges[i] || null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-campiq-text-primary mb-3">Compare Colleges</h1>
          <p className="text-campiq-text-secondary max-w-2xl">
            Evaluate up to 3 colleges side-by-side to find the perfect fit based on fees, placements, rankings, and more.
          </p>
        </div>
        
        {colleges.length >= 2 && (
          <Button variant="secondary" onClick={handleShare} className="shrink-0 w-full md:w-auto">
            {copied ? <Check size={18} className="mr-2 text-campiq-teal" /> : <Share2 size={18} className="mr-2" />}
            {copied ? 'Link Copied!' : 'Share Comparison'}
          </Button>
        )}
      </div>

      {/* Selectors Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {slots.map((college, index) => (
          <motion.div
            key={college ? college.id : `empty-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CollegeSelector
              selectedCollege={college}
              onSelect={(c) => handleSelect(c, index)}
              onRemove={() => college && handleRemove(college.id)}
              index={index}
            />
          </motion.div>
        ))}
      </div>

      {/* Comparison Area */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-campiq-text-muted">Loading comparison...</div>
        </div>
      ) : colleges.length >= 2 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-campiq-text-primary">Detailed Analysis</h2>
          </div>
          <CompareTable colleges={colleges} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center bg-campiq-surface border border-campiq-border rounded-2xl border-dashed"
        >
          <div className="w-20 h-20 bg-campiq-raised rounded-full flex items-center justify-center mb-6">
            <LayoutGrid className="h-10 w-10 text-campiq-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-campiq-text-primary mb-2">Select at least 2 colleges</h3>
          <p className="text-campiq-text-secondary max-w-md mx-auto mb-8">
            Add colleges using the slots above to see a detailed side-by-side comparison of fees, placements, and ratings.
          </p>
          <Link href="/explore">
            <Button>Explore Colleges</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-campiq-teal">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
