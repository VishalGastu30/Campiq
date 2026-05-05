'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { College } from '@/types';
import { SwipeableCard } from '@/components/explore/SwipeableCard';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowLeft, RotateCcw, Share2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DecideModePage() {
  const { user, token } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shortlisted, setShortlisted] = useState<College[]>([]);
  const [skipped, setSkipped] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await api.colleges.getAll({ sort: 'nirfRank', limit: 20, page: 1 });
        setColleges(res.data);
      } catch {
        toast.error('Failed to load colleges');
      } finally {
        setIsLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleSwipeRight = async () => {
    const college = colleges[currentIndex];
    setShortlisted(prev => [...prev, college]);

    // Save to backend if logged in
    if (user && token) {
      try {
        await api.saved.save(token, college.id);
      } catch {
        // silently fail
      }
    }

    advance();
  };

  const handleSwipeLeft = () => {
    setSkipped(prev => [...prev, colleges[currentIndex]]);
    advance();
  };

  const advance = () => {
    if (currentIndex >= colleges.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleShare = async () => {
    const names = shortlisted.map(c => c.name).join(', ');
    const text = `My Campiq Shortlist: ${names}`;
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Campiq Shortlist', text, url });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success('Shortlist copied to clipboard!');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShortlisted([]);
    setSkipped([]);
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-campiq-teal animate-pulse text-lg">Loading colleges...</div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-campiq-base py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-campiq-teal/10 border border-campiq-teal/20 mb-6">
              <Sparkles size={16} className="text-campiq-teal" />
              <span className="text-sm font-medium text-campiq-teal">Decision Complete</span>
            </div>

            <h1 className="text-3xl font-bold text-campiq-text-primary mb-3">
              Your Shortlist is Ready!
            </h1>
            <p className="text-campiq-text-secondary mb-8">
              You shortlisted <span className="text-campiq-teal font-bold">{shortlisted.length}</span> colleges
              and skipped <span className="text-campiq-text-muted">{skipped.length}</span>
            </p>

            {shortlisted.length > 0 && (
              <div className="space-y-3 mb-8 text-left">
                {shortlisted.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={`/college/${c.slug}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-campiq-surface border border-campiq-border
                                 hover:border-campiq-teal/30 transition-all"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-campiq-teal/10 flex items-center justify-center text-sm font-bold text-campiq-teal">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-campiq-text-primary block truncate">{c.name}</span>
                        <span className="text-xs text-campiq-text-muted">{c.city}, {c.state}</span>
                      </div>
                      {c.nirfRank && (
                        <span className="text-xs font-mono text-campiq-teal">#{c.nirfRank}</span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" onClick={handleRestart}>
                <RotateCcw size={16} className="mr-2" /> Start Over
              </Button>
              <Button onClick={handleShare}>
                <Share2 size={16} className="mr-2" /> Share Shortlist
              </Button>
              <Link href="/compare">
                <Button className="bg-gradient-sig border-0 text-white w-full sm:w-auto">
                  Compare Shortlisted
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-campiq-base flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-campiq-border bg-campiq-surface/50 backdrop-blur-sm">
        <Link href="/explore" className="text-campiq-text-muted hover:text-campiq-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-bold text-campiq-text-primary">Decide Mode</h1>
          <p className="text-xs text-campiq-text-muted">
            {currentIndex + 1} / {colleges.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-campiq-teal">{shortlisted.length} saved</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-campiq-base">
        <motion.div
          className="h-full bg-campiq-teal"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / colleges.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card stack */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md h-[520px]">
          <AnimatePresence>
            {colleges[currentIndex] && (
              <SwipeableCard
                key={colleges[currentIndex].id}
                college={colleges[currentIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
