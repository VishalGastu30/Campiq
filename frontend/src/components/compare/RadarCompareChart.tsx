import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { College } from '@/types';
import { motion } from 'framer-motion';

interface Props {
  colleges: College[];
}

const COLORS = ['#00D4A0', '#F5A623', '#9B7BFF', '#FF6B6B'];

function normalizeForRadar(colleges: College[]) {
  if (colleges.length === 0) return [];
  
  return [
    { axis: 'Placement %', ...Object.fromEntries(colleges.map(c => [c.name, c.placementPercent || 0])) },
    { axis: 'NIRF Score', ...Object.fromEntries(colleges.map(c => [c.name, c.nirfRank ? Math.max(0, 100 - c.nirfRank/5) : 50])) },
    { axis: 'Rating', ...Object.fromEntries(colleges.map(c => [c.name, ((c.rating || 3.5) / 5) * 100])) },
    { axis: 'Avg Package', ...Object.fromEntries(colleges.map(c => [c.name, Math.min(100, (c.avgPackage || 0) / 0.4)])) },
    { axis: 'Value Score', ...Object.fromEntries(colleges.map(c => [c.name, Math.min(100, ((c.placementPercent || 0) / ((c.minFees || 100000) / 100000)) * 5)])) },
    { axis: 'Affordability', ...Object.fromEntries(colleges.map(c => [c.name, Math.max(0, 100 - ((c.minFees || 0) / 20000))])) },
  ];
}

export function RadarCompareChart({ colleges }: Props) {
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
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: '#7A93B0', fontSize: 12 }} />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#131B24', 
                border: '1px solid rgba(0, 212, 160, 0.2)',
                borderRadius: '8px',
                color: '#E8F0FC'
              }} 
            />
            
            {colleges.map((college, i) => (
              <Radar
                key={college.id}
                name={college.name}
                dataKey={college.name}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
