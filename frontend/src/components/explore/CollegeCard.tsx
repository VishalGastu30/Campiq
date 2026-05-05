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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col group relative overflow-hidden bg-campiq-surface border-campiq-border hover:border-campiq-teal/30 transition-all duration-300">
        {/* Top Gradient Border */}
        <div className="h-[3px] w-full bg-gradient-sig absolute top-0 inset-x-0" />
        
        <div className="p-4 flex-1 flex flex-col mt-1">
          <div className="flex gap-3 items-start mb-4">
            {/* Logo Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-campiq-base border border-campiq-border text-base font-bold text-campiq-text-primary group-hover:border-campiq-teal/50 transition-colors">
              {getInitials(college.name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-campiq-text-primary leading-tight line-clamp-2 mb-1 group-hover:text-campiq-teal transition-colors">
                <Link href={`/college/${college.slug}`} className="focus:outline-none">
                  <span className="absolute inset-0 z-10" />
                  {college.name}
                </Link>
              </h3>
              <div className="flex flex-wrap items-center text-xs text-campiq-text-muted mt-1 gap-1.5">
                <span className="truncate max-w-[140px] sm:max-w-[180px] lg:max-w-[220px]" title={`${college.city}, ${college.state}`}><MapPin size={12} className="inline mr-0.5 -mt-0.5"/>{college.city}, {college.state}</span>
                <span className="w-1 h-1 rounded-full bg-campiq-text-muted/50" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-campiq-violet px-1.5 py-0.5 bg-campiq-violet/10 rounded-sm">
                  {college.type}
                </span>
              </div>
            </div>
          </div>

          {/* Decision-First Metrics Block */}
          <div className="grid grid-cols-3 gap-0 bg-campiq-base rounded-lg border border-campiq-border overflow-hidden mb-4 p-2.5">
            <div className="flex flex-col justify-center border-r border-campiq-border/50 pr-2">
              <span className="text-[10px] uppercase tracking-wider text-campiq-text-muted mb-0.5 font-medium">Rank</span>
              <span className="font-mono text-campiq-teal font-bold text-lg leading-none">
                {college.nirfRank ? `#${college.nirfRank}` : '-'}
              </span>
            </div>
            <div className="flex flex-col justify-center border-r border-campiq-border/50 px-2">
              <span className="text-[10px] uppercase tracking-wider text-campiq-text-muted mb-0.5 font-medium">Fees</span>
              <span className="font-mono text-campiq-text-primary font-bold text-sm leading-tight truncate">
                {formatFees(college.minFees)}<span className="text-[10px] font-sans text-campiq-text-muted font-normal">/yr</span>
              </span>
            </div>
            <div className="flex flex-col justify-center pl-2">
              <span className="text-[10px] uppercase tracking-wider text-campiq-text-muted mb-0.5 font-medium">Placement</span>
              <span className="font-mono text-campiq-text-primary font-bold text-sm leading-tight">
                {college.placementPercent ? `${college.placementPercent}%` : '-'}
              </span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between relative z-20 pt-1">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCompareToggle}
              className={`h-8 px-4 text-xs bg-transparent border transition-all ${inCompare ? 'border-campiq-teal text-campiq-teal bg-campiq-teal/10' : 'border-campiq-border text-campiq-text-secondary hover:text-campiq-text-primary hover:border-campiq-border-strong hover:bg-campiq-base'}`}
            >
              {inCompare ? 'Added' : 'Compare'}
            </Button>

            <motion.button 
              whileTap={{ scale: 0.85 }}
              onClick={handleSaveToggle}
              disabled={isSaving}
              className={`p-2 rounded-lg transition-colors border outline-none ${isSaved ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-transparent border-transparent text-campiq-text-muted hover:text-red-400 hover:bg-campiq-base'}`}
              title={isSaved ? "Remove from saved" : "Save college"}
            >
              <motion.svg 
                width="18" height="18" viewBox="0 0 24 24" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                animate={{
                  fill: isSaved ? "var(--color-red-500, currentColor)" : "none",
                  scale: isSaved ? [1, 1.3, 1] : 1
                }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.4, 1],
                  ease: "easeInOut"
                }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
