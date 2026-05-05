'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { College } from '@/types';
import { MapPin, ArrowRight } from 'lucide-react';
import { getInitials, formatFees } from '@/lib/utils';

interface Props {
  collegeId: string;
}

export function RelatedColleges({ collegeId }: Props) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${API_URL}/colleges/${collegeId}/related`);
        const json = await res.json();
        if (json.data) {
          setColleges(json.data.slice(0, 4));
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchRelated();
  }, [collegeId]);

  if (isLoading || colleges.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-campiq-text-primary mb-5 flex items-center gap-2">
        Similar Colleges
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colleges.map((college, i) => (
          <motion.div
            key={college.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Link
              href={`/college/${college.slug}`}
              className="group block p-4 rounded-xl bg-campiq-surface border border-campiq-border
                         hover:border-campiq-teal/30 hover:shadow-[0_0_20px_rgba(0,212,160,0.06)]
                         transition-all duration-300"
            >
              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-campiq-base border border-campiq-border text-sm font-bold text-campiq-text-primary group-hover:border-campiq-teal/50 transition-colors">
                  {getInitials(college.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-campiq-text-primary line-clamp-1 group-hover:text-campiq-teal transition-colors">
                    {college.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-campiq-text-muted mt-1">
                    <MapPin size={10} />
                    <span className="truncate">{college.city}, {college.state}</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-campiq-text-muted group-hover:text-campiq-teal transition-colors shrink-0 mt-1" />
              </div>

              <div className="flex gap-4 mt-3 pt-3 border-t border-campiq-border/50">
                {college.nirfRank && (
                  <div className="text-xs">
                    <span className="text-campiq-text-muted">Rank </span>
                    <span className="font-mono font-bold text-campiq-teal">#{college.nirfRank}</span>
                  </div>
                )}
                <div className="text-xs">
                  <span className="text-campiq-text-muted">Fees </span>
                  <span className="font-mono font-bold text-campiq-text-primary">{formatFees(college.minFees)}</span>
                </div>
                {college.placementPercent && (
                  <div className="text-xs">
                    <span className="text-campiq-text-muted">Placement </span>
                    <span className="font-mono font-bold text-campiq-text-primary">{college.placementPercent}%</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
