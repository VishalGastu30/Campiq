import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { College } from '@/types';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  colleges: College[];
}

const COLORS = ['#00D4A0', '#F5A623', '#9B7BFF', '#FF6B6B'];

function getDisplayName(c: College) {
  return c.shortName || c.name;
}

function normalizeForRadar(colleges: College[]) {
  if (colleges.length === 0) return [];
  
  return [
    { axis: 'Placement %', ...Object.fromEntries(colleges.map(c => [getDisplayName(c), c.placementPercent || 0])) },
    { axis: 'NIRF Score', ...Object.fromEntries(colleges.map(c => [getDisplayName(c), c.nirfRank ? Math.max(0, 100 - c.nirfRank/5) : 50])) },
    { axis: 'Rating', ...Object.fromEntries(colleges.map(c => [getDisplayName(c), ((c.rating || 3.5) / 5) * 100])) },
    { axis: 'Avg Package', ...Object.fromEntries(colleges.map(c => [getDisplayName(c), Math.min(100, (c.avgPackage || 0) / 0.4)])) },
    { axis: 'Value Score', ...Object.fromEntries(colleges.map(c => [getDisplayName(c), Math.min(100, ((c.placementPercent || 0) / ((c.minFees || 100000) / 100000)) * 5)])) },
    { axis: 'Affordability', ...Object.fromEntries(colleges.map(c => [getDisplayName(c), Math.max(0, 100 - ((c.minFees || 0) / 20000))])) },
  ];
}

export function RadarCompareChart({ colleges }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Delay render to ensure container has dimensions (fixes width(-1) warning)
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (colleges.length === 0) return null;
  
  const data = normalizeForRadar(colleges);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-campiq-surface border border-campiq-border rounded-2xl p-6"
    >
      <h3 className="text-xs text-campiq-text-muted font-semibold uppercase tracking-wider mb-6">
        Multi-dimensional Comparison
      </h3>
      <div className="w-full" style={{ minHeight: '420px' }}>
        {mounted && (
          <ResponsiveContainer width="100%" height={420}>
            <RadarChart cx="50%" cy="45%" outerRadius="55%" data={data}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis 
                dataKey="axis" 
                tick={{ fill: '#7A93B0', fontSize: 11 }} 
                tickLine={false}
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#131B24', 
                  border: '1px solid rgba(0, 212, 160, 0.2)',
                  borderRadius: '8px',
                  color: '#E8F0FC'
                }} 
              />
              
              {colleges.map((college, i) => {
                const displayName = getDisplayName(college);
                return (
                  <Radar
                    key={college.id}
                    name={displayName}
                    dataKey={displayName}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                );
              })}
              <Legend 
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} 
                iconSize={10}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
