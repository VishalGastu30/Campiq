import { useState, useEffect } from 'react';
import { College } from '@/types';
import { CollegeCard } from './CollegeCard';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { SearchX } from 'lucide-react';
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center bg-campiq-surface border border-campiq-border rounded-2xl"
      >
        <div className="w-20 h-20 bg-campiq-raised rounded-full flex items-center justify-center mb-6 border border-campiq-border">
          <SearchX className="h-10 w-10 text-campiq-text-muted" />
        </div>
        <h3 className="text-xl font-bold text-campiq-text-primary mb-2">No colleges found</h3>
        <p className="text-campiq-text-secondary max-w-md mx-auto">
          We couldn't find any colleges matching your current filters. Try adjusting your search criteria or clearing some filters.
        </p>
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
