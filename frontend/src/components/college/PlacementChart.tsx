'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface PlacementYear {
  year: number;
  placementPercent: number | null;
  avgPackage: number | null;
  highestPackage: number | null;
  studentsPlaced: number | null;
  studentsTotal: number | null;
}

interface Props {
  collegeId: string;
}

export function PlacementChart({ collegeId }: Props) {
  const [data, setData] = useState<PlacementYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${API_URL}/colleges/${collegeId}`);
        const json = await res.json();
        if (json.data?.placementYears) {
          const sorted = json.data.placementYears
            .sort((a: PlacementYear, b: PlacementYear) => a.year - b.year)
            .slice(-5);
          setData(sorted);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [collegeId]);

  if (isLoading || data.length === 0) return null;

  const chartData = data.map(d => ({
    year: d.year.toString(),
    placement: d.placementPercent || 0,
    avgPkg: d.avgPackage ? +(d.avgPackage / 100000).toFixed(1) : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-campiq-surface border border-campiq-border rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-campiq-border flex items-center gap-2">
        <TrendingUp size={18} className="text-campiq-teal" />
        <h3 className="font-bold text-campiq-text-primary">5-Year Placement Trend</h3>
      </div>

      <div className="p-6">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="placementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4A0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D4A0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pkgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9B7BFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9B7BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: '#7A93B0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7A93B0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131B24',
                  border: '1px solid rgba(0, 212, 160, 0.2)',
                  borderRadius: '8px',
                  color: '#E8F0FC',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'placement' ? `${value}%` : `₹${value}L`,
                  name === 'placement' ? 'Placement %' : 'Avg Package'
                ]}
              />
              <Area
                type="monotone"
                dataKey="placement"
                stroke="#00D4A0"
                strokeWidth={2}
                fill="url(#placementGrad)"
              />
              <Area
                type="monotone"
                dataKey="avgPkg"
                stroke="#9B7BFF"
                strokeWidth={2}
                fill="url(#pkgGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-6 mt-4 text-xs text-campiq-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-3 h-[2px] bg-campiq-teal rounded" />
            Placement %
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-[2px] bg-campiq-violet rounded" />
            Avg Package (₹L)
          </div>
        </div>
      </div>
    </motion.div>
  );
}
