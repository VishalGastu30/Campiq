import { College } from '@/types';
import { motion } from 'framer-motion';
import { Star, Gem, TrendingUp, Trophy } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  colleges: College[];
}

function computeVerdict(colleges: College[]) {
  if (colleges.length < 2) return null;
  
  return {
    bestOverall: colleges.reduce((best, c) => {
      const score = ((c.rating || 3.5) * 20) + (c.placementPercent || 0) - ((c.nirfRank || 500) / 10);
      const bestScore = ((best.rating || 3.5) * 20) + (best.placementPercent || 0) - ((best.nirfRank || 500) / 10);
      return score > bestScore ? c : best;
    }),
    bestValue: colleges.reduce((best, c) => {
      const ratio = (c.placementPercent || 0) / ((c.minFees || 100000) / 100000);
      const bestRatio = (best.placementPercent || 0) / ((best.minFees || 100000) / 100000);
      return ratio > bestRatio ? c : best;
    }),
    bestPlacement: colleges.reduce((best, c) =>
      (c.placementPercent || 0) > (best.placementPercent || 0) ? c : best
    ),
    bestRanked: colleges.filter(c => c.nirfRank).reduce((best, c) =>
      (c.nirfRank || 999) < (best.nirfRank || 999) ? c : best
    , colleges[0]),
  };
}

export function VerdictBox({ colleges }: Props) {
  const verdict = computeVerdict(colleges);
  
  if (!verdict) return null;

  const VerdictItem = ({ label, college, icon, color }: { label: string, college: College, icon: ReactNode, color: string }) => (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-campiq-base border border-campiq-border/50">
      <div className="flex items-center gap-2 text-campiq-text-secondary text-sm font-medium">
        <span className={color}>{icon}</span>
        {label}
      </div>
      <div className="font-bold text-campiq-teal line-clamp-2 leading-tight" title={college.name}>
        {college.name}
      </div>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-campiq-surface border border-campiq-border rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-sig" />
      
      <h3 className="text-xs text-campiq-text-muted font-semibold uppercase tracking-wider mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-campiq-teal animate-pulse" />
        Campiq Verdict
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <VerdictItem label="Best Overall" college={verdict.bestOverall} icon={<Star size={16} />} color="text-yellow-400" />
        <VerdictItem label="Best Value" college={verdict.bestValue} icon={<Gem size={16} />} color="text-cyan-400" />
        <VerdictItem label="Best Placement" college={verdict.bestPlacement} icon={<TrendingUp size={16} />} color="text-green-400" />
        <VerdictItem label="Best Ranked" college={verdict.bestRanked} icon={<Trophy size={16} />} color="text-amber-400" />
      </div>
    </motion.div>
  );
}
