'use client';

import { motion } from 'framer-motion';
import { Brain, GitCompareArrows, Radar, Shield, Zap, BarChart3 } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    description: 'Our Groq-powered intelligence engine matches your profile to ideal colleges based on budget, stream, and career goals.',
    accent: 'campiq-teal',
  },
  {
    icon: GitCompareArrows,
    title: 'Multi-Dimensional Compare',
    description: 'Radar charts, weighted priority sliders, and verdict analysis to compare up to 3 colleges simultaneously.',
    accent: 'campiq-violet',
  },
  {
    icon: Radar,
    title: 'Decision-First Metrics',
    description: 'Every college card leads with NIRF Rank, Fees, and Placement % — the three numbers that actually matter.',
    accent: 'campiq-amber',
  },
  {
    icon: BarChart3,
    title: '5-Year Placement Trends',
    description: 'Historical placement data so you can see trajectory, not just a single snapshot year.',
    accent: 'campiq-teal',
  },
  {
    icon: Shield,
    title: 'Verified NIRF 2024 Data',
    description: 'Rankings sourced from official NIRF 2024 data, not user-generated content or marketing material.',
    accent: 'campiq-violet',
  },
  {
    icon: Zap,
    title: 'Instant AI Summaries',
    description: 'One-click AI analysis that distills a college\'s strengths, weaknesses, and unique position in 30 seconds.',
    accent: 'campiq-amber',
  },
];

export function Differentiators() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-campiq-violet/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs text-campiq-amber font-mono uppercase tracking-[0.2em] mb-3">Why Campiq</p>
          <h2 className="text-3xl md:text-4xl font-bold text-campiq-text-primary tracking-tight mb-4">
            Built for <span className="text-transparent bg-clip-text bg-gradient-sig">Ambitious Students</span>
          </h2>
          <p className="text-campiq-text-secondary max-w-2xl mx-auto">
            Not another college directory. Campiq is an intelligence platform engineered for the student who refuses to leave their future to chance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative p-6 rounded-2xl bg-campiq-surface/60 border border-campiq-border/50
                         hover:border-campiq-teal/30 backdrop-blur-sm
                         hover:shadow-[0_0_40px_rgba(0,212,160,0.06)] transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-sig rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`inline-flex p-3 rounded-xl mb-4 bg-${feature.accent}/10`}>
                <feature.icon size={22} className={`text-${feature.accent}`} />
              </div>

              <h3 className="text-lg font-bold text-campiq-text-primary mb-2 group-hover:text-campiq-teal transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-campiq-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
