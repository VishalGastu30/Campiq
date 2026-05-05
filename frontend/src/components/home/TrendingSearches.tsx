'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const TRENDING = [
  { query: 'IIT Bombay', slug: 'indian-institute-of-technology-bombay', trend: '+12%' },
  { query: 'IIT Madras', slug: 'indian-institute-of-technology-madras', trend: '+9%' },
  { query: 'NIT Trichy', slug: 'national-institute-of-technology-tiruchirappalli', trend: '+7%' },
  { query: 'IIM Ahmedabad', slug: 'indian-institute-of-management-ahmedabad', trend: '+15%' },
  { query: 'VIT Vellore', slug: 'vellore-institute-of-technology', trend: '+6%' },
  { query: 'SRM Chennai', slug: 'srm-institute-of-science-and-technology', trend: '+5%' },
  { query: 'IISc Bangalore', slug: 'indian-institute-of-science', trend: '+8%' },
  { query: 'AIIMS Delhi', slug: 'all-india-institute-of-medical-sciences-delhi', trend: '+4%' },
];

export function TrendingSearches() {
  return (
    <section className="py-16 md:py-24 bg-campiq-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="p-2 rounded-lg bg-campiq-teal/10">
            <TrendingUp size={18} className="text-campiq-teal" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary tracking-tight">
            Trending Right Now
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TRENDING.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/college/${item.slug}`}
                className="group flex items-center justify-between p-4 rounded-xl
                           bg-campiq-base border border-campiq-border/50
                           hover:border-campiq-teal/30 hover:bg-campiq-surface
                           transition-all duration-300"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-campiq-surface flex items-center justify-center text-xs font-mono text-campiq-text-muted">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-campiq-text-primary truncate group-hover:text-campiq-teal transition-colors">
                    {item.query}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-mono text-campiq-teal">{item.trend}</span>
                  <ArrowUpRight size={14} className="text-campiq-text-muted group-hover:text-campiq-teal transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
