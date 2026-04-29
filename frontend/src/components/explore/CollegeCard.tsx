import Link from 'next/link';
import { MapPin, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { College } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { formatFees, formatLPA, getInitials } from '@/lib/utils';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CollegeCardProps {
  college: College;
  index?: number;
  savedCollegeIds?: Set<string>;
  onSavedChange?: () => void;
}

export function CollegeCard({ college, index = 0, savedCollegeIds, onSavedChange }: CollegeCardProps) {
  const { compareIds, addToCompare, removeFromCompare } = useCompare();
  const { user, token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const inCompare = compareIds.includes(college.id);
  const isSaved = savedCollegeIds?.has(college.id) ?? false;

  const handleSaveToggle = async () => {
    if (!user || !token) {
      toast.error('Please login to save colleges');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await api.saved.remove(token, college.id);
        toast.success('Removed from saved');
      } else {
        await api.saved.save(token, college.id);
        toast.success('College saved');
      }
      onSavedChange?.();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update saved status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col group relative overflow-hidden">
        {/* Top Gradient Border */}
        <div className="h-1.5 w-full bg-gradient-sig absolute top-0 inset-x-0" />
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex gap-4 items-start mb-4">
            {/* Logo Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-campiq-raised border border-campiq-border text-lg font-bold text-campiq-teal">
              {getInitials(college.name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-campiq-text-primary leading-tight line-clamp-2 mb-1 group-hover:text-campiq-teal transition-colors">
                <Link href={`/college/${college.slug}`} className="focus:outline-none">
                  <span className="absolute inset-0 z-10" />
                  {college.name}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-campiq-text-muted mt-1">
                <MapPin size={14} className="mr-1" />
                <span className="truncate">{college.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-campiq-border/50">
            <StarRating rating={college.rating} />
            <div className="flex gap-2 relative z-20">
              {college.nirfRank && (
                <Badge variant="amber" className="hidden sm:inline-flex">NIRF #{college.nirfRank}</Badge>
              )}
              {college.naacGrade && (
                <Badge variant="violet">{college.naacGrade}</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
            <div>
              <p className="text-campiq-text-muted mb-0.5">Annual Fees</p>
              <p className="font-medium text-campiq-text-primary">{formatFees(college.minFees)}</p>
            </div>
            <div>
              <p className="text-campiq-text-muted mb-0.5">Avg Package</p>
              <p className="font-medium text-campiq-text-primary text-campiq-teal flex items-center gap-1">
                <Trophy size={14} /> {formatLPA(college.avgPackage)}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between relative z-20">
            <label className="flex items-center gap-2 cursor-pointer group/checkbox">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={inCompare}
                  onChange={handleCompareToggle}
                  className="peer appearance-none w-5 h-5 border border-campiq-text-muted rounded-md bg-campiq-base checked:bg-campiq-teal checked:border-campiq-teal transition-all"
                />
                <svg className="absolute w-3 h-3 text-campiq-base pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-campiq-text-secondary group-hover/checkbox:text-campiq-text-primary transition-colors">Compare</span>
            </label>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveToggle}
                disabled={isSaving}
                className={`p-2 rounded-lg transition-colors border ${isSaved ? 'bg-campiq-teal/10 border-campiq-teal/20 text-campiq-teal' : 'bg-campiq-raised border-campiq-border text-campiq-text-muted hover:text-red-400 hover:border-red-400/30'}`}
                title={isSaved ? "Remove from saved" : "Save college"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <Button size="sm" variant="secondary" className="px-4" onClick={() => window.location.href = `/college/${college.slug}`}>
                View
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
