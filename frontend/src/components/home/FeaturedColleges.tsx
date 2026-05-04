'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { College } from '@/types';
import { api } from '@/lib/api';
import { CollegeCard } from '@/components/explore/CollegeCard';
import { SkeletonLoader } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';

export function FeaturedColleges() {
  const { user, token } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchTopColleges = async () => {
      try {
        const res = await api.colleges.getAll({ limit: 6, sort: 'nirfRank' });
        setColleges(res.data);
      } catch (e) {
        console.error('Failed to fetch top colleges', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopColleges();
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-campiq-text-primary mb-3">Top Ranked Colleges</h2>
          <div className="h-1 w-20 bg-gradient-sig rounded-full" />
          <p className="text-campiq-text-secondary mt-4 max-w-2xl">
            Discover the most prestigious institutions across India, ranked by NIRF and user reviews.
          </p>
        </div>
        <Link 
          href="/explore" 
          className="inline-flex items-center text-campiq-teal font-medium hover:text-white transition-colors group"
        >
          View all colleges
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loading State
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-campiq-border bg-campiq-surface p-4 h-[240px] flex flex-col mt-2">
              <div className="flex gap-3 mb-4">
                <SkeletonLoader width={48} height={48} borderRadius={8} />
                <div className="flex-1">
                  <SkeletonLoader height={20} className="mb-2 w-3/4" />
                  <SkeletonLoader height={14} className="w-1/2" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-0 mb-4 bg-campiq-base rounded-lg border border-campiq-border p-2">
                <div className="border-r border-campiq-border/50 pr-2">
                  <SkeletonLoader height={12} className="mb-2 w-1/2" />
                  <SkeletonLoader height={18} className="w-3/4" />
                </div>
                <div className="border-r border-campiq-border/50 px-2">
                  <SkeletonLoader height={12} className="mb-2 w-1/2" />
                  <SkeletonLoader height={18} className="w-full" />
                </div>
                <div className="pl-2">
                  <SkeletonLoader height={12} className="mb-2 w-1/2" />
                  <SkeletonLoader height={18} className="w-3/4" />
                </div>
              </div>

              <div className="mt-auto flex justify-between pt-1">
                <SkeletonLoader width={80} height={32} borderRadius={6} />
                <SkeletonLoader width={36} height={36} borderRadius={8} />
              </div>
            </div>
          ))
        ) : (
          colleges.map((college, idx) => (
            <CollegeCard 
              key={college.id} 
              college={college} 
              index={idx} 
              savedCollegeIds={savedIds}
              onSavedChange={fetchSaved}
            />
          ))
        )}
      </div>
    </section>
  );
}
