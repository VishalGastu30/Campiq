'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { api } from '@/lib/api';
import { Database, GraduationCap, TrendingUp, MapPin } from 'lucide-react';

interface Stats {
  totalColleges: number;
  totalStreams: number;
  avgPlacement: number;
  totalStates: number;
}

function MetricTile({ value, label, suffix, icon: Icon, delay }: {
  value: number;
  label: string;
  suffix: string;
  icon: React.ElementType;
  delay: number;
}) {
  const { count, ref } = useCountUp(value, 2200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 rounded-2xl bg-campiq-surface/80 border border-campiq-border backdrop-blur-sm
                 hover:border-campiq-teal/30 hover:shadow-[0_0_30px_rgba(0,212,160,0.08)] transition-all duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-sig rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-campiq-teal/10 text-campiq-teal">
          <Icon size={20} />
        </div>
      </div>

      <div className="font-mono text-3xl md:text-4xl font-bold text-campiq-text-primary tracking-tight mb-1">
        {(count || 0).toLocaleString()}<span className="text-campiq-teal text-2xl">{suffix}</span>
      </div>
      <p className="text-sm text-campiq-text-muted uppercase tracking-widest font-medium">{label}</p>
    </motion.div>
  );
}

export function DecisionDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/stats`);
        const json = await res.json();
        setStats(json.data);
      } catch {
        // Fallback
        setStats({ totalColleges: 800, totalStreams: 10, avgPlacement: 78, totalStates: 28 });
      }
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  const metrics = [
    { value: stats.totalColleges, label: 'Colleges Tracked', suffix: '+', icon: Database },
    { value: stats.totalStreams, label: 'Streams Covered', suffix: '', icon: GraduationCap },
    { value: Math.round(stats.avgPlacement), label: 'Avg. Placement', suffix: '%', icon: TrendingUp },
    { value: stats.totalStates, label: 'States & UTs', suffix: '', icon: MapPin },
  ];

  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs text-campiq-teal font-mono uppercase tracking-[0.2em] mb-3">Live Platform Intelligence</p>
          <h2 className="text-3xl md:text-4xl font-bold text-campiq-text-primary tracking-tight">
            Data That <span className="text-transparent bg-clip-text bg-gradient-sig">Drives Decisions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, i) => (
            <MetricTile key={m.label} {...m} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
