import { useState, useEffect } from 'react';
import { College } from '@/types';
import { CollegeCard } from './CollegeCard';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { SearchX, Map, GraduationCap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CollegeGridProps {
  colleges: College[];
  isLoading: boolean;
}

export function CollegeGrid({ colleges, isLoading }: CollegeGridProps) {
  const { user, token } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchSaved = async () => {
    if (user && token) {
      try {
        const saved = await api.saved.getAll(token);
        setSavedIds(new Set(saved.map(s => s.collegeId)));
      } catch (e) {}
    } else {
      setSavedIds(new Set());
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-campiq-border bg-campiq-surface p-5 h-[340px] flex flex-col">
            <div className="flex gap-4 mb-4">
              <SkeletonLoader width={56} height={56} borderRadius={12} />
              <div className="flex-1">
                <SkeletonLoader count={2} className="mb-2" />
              </div>
            </div>
            <SkeletonLoader height={24} width="60%" className="mb-6" />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <SkeletonLoader height={40} />
              <SkeletonLoader height={40} />
            </div>
            <div className="mt-auto flex justify-between">
              <SkeletonLoader width={100} height={36} />
              <SkeletonLoader width={80} height={36} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4 text-center bg-campiq-surface/50 border border-campiq-border border-dashed rounded-3xl"
      >
        {/* Animated Illustration */}
        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 w-20 h-20 bg-campiq-base rounded-2xl border border-campiq-border flex items-center justify-center shadow-xl shadow-campiq-teal/5"
          >
            <SearchX className="h-10 w-10 text-campiq-teal" />
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 8, 0], rotate: [-10, -5, -10] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-4 top-4 z-10 w-14 h-14 bg-campiq-raised rounded-xl border border-campiq-border/50 flex items-center justify-center opacity-80"
          >
            <Map className="h-6 w-6 text-campiq-text-muted" />
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -8, 0], rotate: [10, 5, 10] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-2 bottom-4 z-10 w-16 h-16 bg-campiq-raised rounded-xl border border-campiq-border/50 flex items-center justify-center opacity-80"
          >
            <GraduationCap className="h-7 w-7 text-campiq-text-muted" />
          </motion.div>
          
          <div className="absolute inset-0 bg-campiq-teal/5 rounded-full blur-3xl -z-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-campiq-text-primary mb-3">No matches found</h3>
        <p className="text-campiq-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
          We couldn't find any colleges matching your exact filters. Try broadening your search or exploring different categories.
        </p>
        
        <button 
          onClick={() => window.location.href = '/explore'}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-campiq-raised border border-campiq-border text-campiq-text-primary hover:bg-campiq-base hover:border-campiq-teal/30 hover:text-campiq-teal transition-all font-medium"
        >
          <RefreshCw size={18} />
          Reset All Filters
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {colleges.map((college, idx) => (
        <CollegeCard 
          key={college.id} 
          college={college} 
          index={idx} 
          savedCollegeIds={savedIds}
          onSavedChange={fetchSaved}
        />
      ))}
    </div>
  );
}
