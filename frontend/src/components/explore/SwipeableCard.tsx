'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { College } from '@/types';
import { MapPin, Check, X } from 'lucide-react';
import { getInitials, formatFees } from '@/lib/utils';

interface Props {
  college: College;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeableCard({ college, onSwipeLeft, onSwipeRight }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const leftIndicatorOpacity = useTransform(x, [-150, -50], [1, 0]);
  const rightIndicatorOpacity = useTransform(x, [50, 150], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-full rounded-3xl bg-campiq-surface border border-campiq-border overflow-hidden shadow-2xl">
        {/* Gradient top bar */}
        <div className="h-[4px] w-full bg-gradient-sig" />

        {/* Swipe indicators */}
        <motion.div
          style={{ opacity: rightIndicatorOpacity }}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-campiq-teal/20 border-2 border-campiq-teal"
        >
          <Check size={20} className="text-campiq-teal" />
          <span className="text-sm font-bold text-campiq-teal">SHORTLIST</span>
        </motion.div>

        <motion.div
          style={{ opacity: leftIndicatorOpacity }}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border-2 border-red-500"
        >
          <X size={20} className="text-red-500" />
          <span className="text-sm font-bold text-red-500">SKIP</span>
        </motion.div>

        {/* Card content */}
        <div className="p-8 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-campiq-base border border-campiq-border flex items-center justify-center text-2xl font-bold text-campiq-teal">
              {getInitials(college.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-campiq-text-primary line-clamp-2 mb-1">
                {college.name}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-campiq-text-secondary">
                <MapPin size={14} />
                <span>{college.city}, {college.state}</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-campiq-base rounded-xl p-4 border border-campiq-border text-center">
              <span className="text-[10px] uppercase tracking-wider text-campiq-text-muted block mb-1">Rank</span>
              <span className="font-mono text-2xl font-bold text-campiq-teal">
                {college.nirfRank ? `#${college.nirfRank}` : '—'}
              </span>
            </div>
            <div className="bg-campiq-base rounded-xl p-4 border border-campiq-border text-center">
              <span className="text-[10px] uppercase tracking-wider text-campiq-text-muted block mb-1">Fees</span>
              <span className="font-mono text-lg font-bold text-campiq-text-primary">
                {formatFees(college.minFees)}
              </span>
            </div>
            <div className="bg-campiq-base rounded-xl p-4 border border-campiq-border text-center">
              <span className="text-[10px] uppercase tracking-wider text-campiq-text-muted block mb-1">Placement</span>
              <span className="font-mono text-lg font-bold text-campiq-text-primary">
                {college.placementPercent ? `${college.placementPercent}%` : '—'}
              </span>
            </div>
          </div>

          {/* Type badge */}
          <div className="flex gap-2 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-campiq-violet px-3 py-1.5 bg-campiq-violet/10 rounded-lg border border-campiq-violet/20">
              {college.type}
            </span>
            {college.naacGrade && (
              <span className="text-xs uppercase font-bold tracking-wider text-campiq-amber px-3 py-1.5 bg-campiq-amber/10 rounded-lg border border-campiq-amber/20">
                NAAC {college.naacGrade}
              </span>
            )}
          </div>

          {/* About */}
          <p className="text-sm text-campiq-text-secondary leading-relaxed line-clamp-4 flex-1">
            {college.about || 'No description available.'}
          </p>

          {/* Swipe hint */}
          <div className="mt-auto pt-6 text-center">
            <p className="text-xs text-campiq-text-muted">
              ← Swipe left to skip · Swipe right to shortlist →
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
