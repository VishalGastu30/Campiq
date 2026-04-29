'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth, useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SavedCollege } from '@/types';
import { CollegeCard } from '@/components/explore/CollegeCard';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { BookmarkX } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SavedPage() {
  const { user, isLoading: isAuthLoading } = useRequireAuth();
  const { token } = useAuth();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSaved = () => {
    if (user && token) {
      api.saved.getAll(token)
        .then(setSavedColleges)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [user, token]);

  if (isAuthLoading || (isLoading && user)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <SkeletonLoader height={40} width={250} className="mb-4" />
          <SkeletonLoader height={20} width={400} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} height={340} borderRadius={16} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null; // Handled by useRequireAuth

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-campiq-text-primary mb-3">Saved Colleges</h1>
        <p className="text-campiq-text-secondary">
          Your personalized shortlist. Keep track of the colleges you're interested in.
        </p>
      </div>

      {savedColleges.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center bg-campiq-surface border border-campiq-border rounded-2xl"
        >
          <div className="w-20 h-20 bg-campiq-raised rounded-full flex items-center justify-center mb-6">
            <BookmarkX className="h-10 w-10 text-campiq-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-campiq-text-primary mb-2">No saved colleges yet</h3>
          <p className="text-campiq-text-secondary max-w-md mx-auto mb-8">
            You haven't added any colleges to your shortlist. Start exploring and save the ones you like.
          </p>
          <Link href="/explore">
            <Button>Explore Colleges</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((saved, index) => (
            <CollegeCard 
              key={saved.id} 
              college={saved.college} 
              index={index} 
              savedCollegeIds={new Set([saved.collegeId])}
              onSavedChange={fetchSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
}
