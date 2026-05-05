'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Stream } from '@/types';
import {
  Cpu, Briefcase, HeartPulse, Scale, Palette,
  FlaskConical, ShoppingCart, PenTool, Pill, Leaf
} from 'lucide-react';

const STREAM_DATA: { stream: Stream; label: string; icon: React.ElementType; gradient: string }[] = [
  { stream: 'ENGINEERING', label: 'Engineering', icon: Cpu, gradient: 'from-campiq-teal/20 to-campiq-teal/5' },
  { stream: 'MANAGEMENT', label: 'Management', icon: Briefcase, gradient: 'from-amber-500/20 to-amber-500/5' },
  { stream: 'MEDICAL', label: 'Medical', icon: HeartPulse, gradient: 'from-red-400/20 to-red-400/5' },
  { stream: 'LAW', label: 'Law', icon: Scale, gradient: 'from-blue-400/20 to-blue-400/5' },
  { stream: 'ARTS', label: 'Arts', icon: Palette, gradient: 'from-pink-400/20 to-pink-400/5' },
  { stream: 'SCIENCE', label: 'Science', icon: FlaskConical, gradient: 'from-violet-400/20 to-violet-400/5' },
  { stream: 'COMMERCE', label: 'Commerce', icon: ShoppingCart, gradient: 'from-emerald-400/20 to-emerald-400/5' },
  { stream: 'DESIGN', label: 'Design', icon: PenTool, gradient: 'from-rose-400/20 to-rose-400/5' },
  { stream: 'PHARMACY', label: 'Pharmacy', icon: Pill, gradient: 'from-cyan-400/20 to-cyan-400/5' },
  { stream: 'AGRICULTURE', label: 'Agriculture', icon: Leaf, gradient: 'from-lime-400/20 to-lime-400/5' },
];

export function StreamCarousel() {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-campiq-violet font-mono uppercase tracking-[0.2em] mb-3">Explore by Field</p>
          <h2 className="text-3xl md:text-4xl font-bold text-campiq-text-primary tracking-tight">
            Every Stream, <span className="text-transparent bg-clip-text bg-gradient-sig">One Platform</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {STREAM_DATA.map((item, i) => (
            <motion.div
              key={item.stream}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/explore?stream=${item.stream}`}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b ${item.gradient}
                           border border-campiq-border/50 hover:border-campiq-teal/40
                           hover:shadow-[0_0_24px_rgba(0,212,160,0.1)] transition-all duration-400`}
              >
                <div className="p-3 rounded-xl bg-campiq-surface/80 group-hover:bg-campiq-teal/10 transition-colors duration-300">
                  <item.icon size={24} className="text-campiq-text-secondary group-hover:text-campiq-teal transition-colors duration-300" />
                </div>
                <span className="text-sm font-semibold text-campiq-text-primary group-hover:text-campiq-teal transition-colors">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
