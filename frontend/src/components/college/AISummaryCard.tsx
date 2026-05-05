'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  collegeId: string;
  existingSummary?: string | null;
}

export function AISummaryCard({ collegeId, existingSummary }: Props) {
  const [summary, setSummary] = useState(existingSummary || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!existingSummary);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    setIsLoading(true);
    setError('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${API_URL}/colleges/${collegeId}/generate-summary`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.data?.summary) {
        setSummary(json.data.summary);
        setIsExpanded(true);
      } else {
        setError('Failed to generate summary');
      }
    } catch {
      setError('Something went wrong. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-campiq-surface border border-campiq-violet/20 rounded-2xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-campiq-violet/10 to-campiq-teal/5 px-6 py-4 border-b border-campiq-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-campiq-violet" />
          <h3 className="font-bold text-campiq-text-primary">AI Intelligence Summary</h3>
        </div>
        {summary && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-campiq-text-muted hover:text-campiq-text-primary transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      <div className="p-6">
        {!summary && !isLoading && (
          <div className="text-center py-4">
            <p className="text-sm text-campiq-text-secondary mb-4">
              Get an AI-powered analysis of this college's strengths, weaknesses, and unique positioning.
            </p>
            <Button
              onClick={generateSummary}
              className="bg-gradient-to-r from-campiq-violet to-campiq-teal border-0 text-white"
            >
              <Sparkles size={16} className="mr-2" />
              Generate Summary
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3 py-2">
            <div className="h-3 bg-campiq-raised rounded animate-pulse w-full" />
            <div className="h-3 bg-campiq-raised rounded animate-pulse w-5/6" />
            <div className="h-3 bg-campiq-raised rounded animate-pulse w-4/6" />
            <div className="h-3 bg-campiq-raised rounded animate-pulse w-full" />
            <div className="h-3 bg-campiq-raised rounded animate-pulse w-3/4" />
            <p className="text-xs text-campiq-violet mt-4 flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin" />
              Analyzing college data...
            </p>
          </div>
        )}

        <AnimatePresence>
          {summary && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="text-sm text-campiq-text-secondary leading-relaxed whitespace-pre-line">
                {summary}
              </div>
              <button
                onClick={generateSummary}
                disabled={isLoading}
                className="mt-4 text-xs text-campiq-violet hover:text-campiq-teal transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-sm text-red-400 mt-2">{error}</p>
        )}
      </div>
    </motion.div>
  );
}
