'use client';

import { useCountUp } from '@/hooks/useCountUp';

function StatItem({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl md:text-5xl font-bold text-campiq-text-primary mb-2 tracking-tight flex items-baseline justify-center">
        {count.toLocaleString()}<span className="text-campiq-teal ml-1">{suffix}</span>
      </div>
      <p className="text-sm md:text-base text-campiq-text-secondary font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="relative z-20 border-y border-campiq-border bg-campiq-surface/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-campiq-border">
          <div className="col-span-2 md:col-span-1 border-b md:border-b-0 border-campiq-border">
             <StatItem value={1200} label="Colleges" suffix="+" />
          </div>
          <div className="col-span-2 md:col-span-1 border-b md:border-b-0 border-campiq-border">
             <StatItem value={28} label="States" suffix="" />
          </div>
          <div className="col-span-2 md:col-span-1 border-r border-campiq-border">
             <StatItem value={50} label="Students" suffix="k+" />
          </div>
          <div className="col-span-2 md:col-span-1">
             <StatItem value={95} label="Satisfaction" suffix="%" />
          </div>
        </div>
      </div>
    </section>
  );
}
