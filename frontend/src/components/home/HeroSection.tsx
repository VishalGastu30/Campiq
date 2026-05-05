'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { AiRecommenderModal } from './AiRecommenderModal';
import { ConstellationCanvas } from './ConstellationCanvas';

const placeholders = [
  { text: "Search by college name...", icon: <Search size={20} /> },
  { text: "Search by city or state...", icon: <MapPin size={20} /> },
  { text: "Search by course...", icon: <BookOpen size={20} /> },
];

export function HeroSection() {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [totalColleges, setTotalColleges] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/stats`);
        const json = await res.json();
        if (json.data?.totalColleges) {
          setTotalColleges(json.data.totalColleges);
        }
      } catch {}
    };
    fetchStats();
  }, []);

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/explore');
    }
  };

  const titleWords = ["Find", "Your", "Perfect"];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
      {/* Constellation Canvas Background */}
      <ConstellationCanvas />

      {/* Ambient orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-campiq-teal/8 rounded-full blur-[140px] animate-orb-drift" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-campiq-violet/8 rounded-full blur-[140px] animate-orb-drift" style={{ animationDelay: '-7.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-campiq-surface border border-campiq-border mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-campiq-teal shadow-[0_0_8px_#00D4A0] animate-pulse" />
          <span className="text-xs font-medium text-campiq-text-secondary">Discover {totalColleges ? (Math.floor(totalColleges / 10) * 10) + '+' : '290+'} colleges across India</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="inline-block mr-3 md:mr-4 text-campiq-text-primary"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block text-transparent bg-clip-text bg-gradient-sig"
          >
            Campus.
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg md:text-xl text-campiq-text-secondary mb-12 max-w-2xl mx-auto"
        >
          Search, compare, and decide smarter. The ultimate platform to shortlist your dream destination.
        </motion.p>

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.8 }}
          onSubmit={handleSearch}
          className="relative max-w-3xl mx-auto mb-12 group"
        >
          <div className="absolute inset-0 bg-gradient-sig rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative flex items-center bg-campiq-surface border border-campiq-border rounded-2xl p-2 shadow-2xl transition-colors group-hover:border-campiq-teal/30">
            <div className="pl-4 text-campiq-text-muted">
              <AnimatePresence mode="wait">
                <motion.div
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {placeholders[placeholderIndex].icon}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="relative flex-1 h-14">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent outline-none px-4 text-lg text-campiq-text-primary z-10"
                placeholder="" // Real placeholder handled by animated div below
              />
              {!query && (
                <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-campiq-text-muted text-lg z-0">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="truncate"
                    >
                      {placeholders[placeholderIndex].text}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            <Button type="submit" size="lg" className="rounded-xl px-8 hidden sm:flex">
              Search
            </Button>
          </div>
        </motion.form>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="sm:hidden w-full" onClick={() => router.push('/explore')}>
            Explore Colleges <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => router.push('/compare')}>
            Compare Now
          </Button>
          <Button size="lg" className="bg-gradient-sig text-white border-0 shadow-[0_0_20px_rgba(155,123,255,0.4)] hover:shadow-[0_0_30px_rgba(155,123,255,0.6)] hover:-translate-y-0.5 transition-all duration-300" onClick={() => router.push('/find-my-college')}>
            <Sparkles className="mr-2" size={18} /> Find My College
          </Button>
        </motion.div>
      </div>
      
      <AiRecommenderModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </section>
  );
}
