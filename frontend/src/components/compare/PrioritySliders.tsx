import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { College } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  colleges: College[];
}

export function PrioritySliders({ colleges }: Props) {
  const [weights, setWeights] = useState({ fees: 5, placement: 5, rank: 5 });
  const [sortedColleges, setSortedColleges] = useState<College[]>([]);

  useEffect(() => {
    if (colleges.length < 2) return;
    
    const withScores = colleges.map(college => {
      const feesScore = Math.max(0, 100 - ((college.minFees || 0) / 20000));
      const placementScore = college.placementPercent || 0;
      const rankScore = college.nirfRank ? Math.max(0, 100 - college.nirfRank / 5) : 50;

      const totalWeight = weights.fees + weights.placement + weights.rank;
      const weightedScore = totalWeight === 0 ? 0 : 
        (feesScore * weights.fees + placementScore * weights.placement + rankScore * weights.rank) / totalWeight;

      return { ...college, weightedScore };
    });

    setSortedColleges(withScores.sort((a, b) => b.weightedScore - a.weightedScore));
  }, [colleges, weights]);

  if (colleges.length < 2) return null;

  return (
    <div className="bg-campiq-surface border border-campiq-border rounded-2xl p-6">
      <h3 className="text-xs text-campiq-text-muted font-semibold uppercase tracking-wider mb-6">
        Priority Weighting
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-campiq-text-primary">Fees Importance</span>
            <span className="text-campiq-teal">{weights.fees}/10</span>
          </div>
          <Slider.Root 
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[weights.fees]} 
            max={10} 
            step={1}
            onValueChange={([val]) => setWeights(w => ({ ...w, fees: val }))}
          >
            <Slider.Track className="bg-campiq-base relative grow rounded-full h-[4px]">
              <Slider.Range className="absolute bg-campiq-teal rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:bg-campiq-teal focus:outline-none focus:shadow-[0_0_0_5px_rgba(0,212,160,0.2)] transition-colors" />
          </Slider.Root>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-campiq-text-primary">Placement Importance</span>
            <span className="text-campiq-teal">{weights.placement}/10</span>
          </div>
          <Slider.Root 
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[weights.placement]} 
            max={10} 
            step={1}
            onValueChange={([val]) => setWeights(w => ({ ...w, placement: val }))}
          >
            <Slider.Track className="bg-campiq-base relative grow rounded-full h-[4px]">
              <Slider.Range className="absolute bg-campiq-teal rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:bg-campiq-teal focus:outline-none focus:shadow-[0_0_0_5px_rgba(0,212,160,0.2)] transition-colors" />
          </Slider.Root>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-campiq-text-primary">Rank Importance</span>
            <span className="text-campiq-teal">{weights.rank}/10</span>
          </div>
          <Slider.Root 
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[weights.rank]} 
            max={10} 
            step={1}
            onValueChange={([val]) => setWeights(w => ({ ...w, rank: val }))}
          >
            <Slider.Track className="bg-campiq-base relative grow rounded-full h-[4px]">
              <Slider.Range className="absolute bg-campiq-teal rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:bg-campiq-teal focus:outline-none focus:shadow-[0_0_0_5px_rgba(0,212,160,0.2)] transition-colors" />
          </Slider.Root>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-campiq-text-secondary mb-3">Your weighted ranking:</p>
        <div className="space-y-2">
          <AnimatePresence>
            {sortedColleges.map((c, idx) => (
              <motion.div 
                key={c.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-campiq-base border border-campiq-border"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-campiq-surface text-campiq-text-secondary text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-campiq-text-primary truncate max-w-[200px]" title={c.name}>
                    {c.name}
                  </span>
                </div>
                <span className="text-campiq-teal font-mono font-bold text-sm">
                  {(c as any).weightedScore.toFixed(1)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
