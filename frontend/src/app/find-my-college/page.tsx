'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CollegeCard } from '@/components/explore/CollegeCard';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, MapPin,
  GraduationCap, Wallet, Target, CheckCircle2, Globe,
  Cog, BarChart3, Building2, Scale, Palette, FlaskConical,
  Briefcase, PenTool, Pill, Wheat,
  Trophy, Medal, SlidersHorizontal, RotateCcw, Search, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STREAMS = [
  { value: 'ENGINEERING', label: 'Engineering', Icon: Cog },
  { value: 'MANAGEMENT', label: 'Management', Icon: BarChart3 },
  { value: 'MEDICAL', label: 'Medical', Icon: Building2 },
  { value: 'LAW', label: 'Law', Icon: Scale },
  { value: 'ARTS', label: 'Arts', Icon: Palette },
  { value: 'SCIENCE', label: 'Science', Icon: FlaskConical },
  { value: 'COMMERCE', label: 'Commerce', Icon: Briefcase },
  { value: 'DESIGN', label: 'Design', Icon: PenTool },
  { value: 'PHARMACY', label: 'Pharmacy', Icon: Pill },
  { value: 'AGRICULTURE', label: 'Agriculture', Icon: Wheat },
];

const BUDGETS = [
  { value: 200000, label: 'Under ₹2L', description: 'Government / Affordable' },
  { value: 500000, label: 'Under ₹5L', description: 'Mid-Range' },
  { value: 1000000, label: 'Under ₹10L', description: 'Premium Private' },
  { value: 1500000, label: 'Under ₹15L', description: 'Top-Tier Private' },
  { value: 2500000, label: 'Under ₹25L', description: 'Elite / International' },
  { value: 0, label: 'No Limit', description: 'Show me the best' },
];

const PRIORITIES = [
  { value: 'placements', label: 'High Placements', Icon: Target, description: 'Best ROI and career outcomes' },
  { value: 'fees', label: 'Low Fees', Icon: Wallet, description: 'Affordable without compromise' },
  { value: 'ranking', label: 'Top Ranking', Icon: GraduationCap, description: 'NIRF-ranked prestige colleges' },
  { value: 'research', label: 'Research Focus', Icon: Sparkles, description: 'Strong R&D and publications' },
  { value: 'campus', label: 'Campus & Life', Icon: MapPin, description: 'Facilities, hostel, culture' },
];

const STATES = [
  '', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Telangana', 'Uttar Pradesh',
  'West Bengal', 'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'Andhra Pradesh', 'Kerala',
  'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Jharkhand', 'Uttarakhand', 'Assam', 'Goa',
];

const STEP_LABELS = ['Stream', 'Budget', 'Priorities', 'Location'];

export default function FindMyCollegePage() {
  const [step, setStep] = useState(0);
  const [stream, setStream] = useState('');
  const [budget, setBudget] = useState<number | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [showRefine, setShowRefine] = useState(false);

  const { token, user } = useAuth();
  const router = useRouter();

  const canProceed = () => {
    if (step === 0) return !!stream;
    if (step === 1) return budget !== null;
    if (step === 2) return priorities.length > 0;
    return true; // step 3 (location is optional)
  };

  const handleSubmit = async () => {
    if (!token || !user) {
      toast.error('Please login to use AI recommendations');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${API_URL}/ai/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          stream,
          budget: budget || 0,
          priority: priorities,
          state: state || undefined,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setResults(json.data.recommendations);
        setAiAnalysis(json.data.analysis || '');
      } else {
        toast.error('Failed to get recommendations');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePriority = (value: string) => {
    setPriorities(prev =>
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    );
  };

  // Results view
  if (results) {
    // Sort results by matchScore descending for leaderboard
    const sorted = [...results].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return (
      <div className="min-h-screen bg-campiq-base py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-campiq-teal/10 border border-campiq-teal/20 mb-6">
              <Sparkles size={16} className="text-campiq-teal" />
              <span className="text-sm font-medium text-campiq-teal">AI Analysis Complete</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-campiq-text-primary mb-3">
              Your Top Matches
            </h1>
            <p className="text-campiq-text-secondary max-w-xl mx-auto">
              Based on {stream.toLowerCase()} in {state || 'all states'}, under {budget === 0 ? 'no budget limit' : `₹${(budget! / 100000).toFixed(0)}L`}
            </p>
          </motion.div>

          {/* Refine Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowRefine(!showRefine)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-campiq-surface/40 backdrop-blur-md border border-campiq-teal/30 text-sm font-semibold text-campiq-teal shadow-[0_0_20px_rgba(0,212,160,0.1)] hover:bg-campiq-teal/10 hover:shadow-[0_0_25px_rgba(0,212,160,0.2)] transition-all duration-300 group"
            >
              <SlidersHorizontal size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              Refine Search
            </button>

            <AnimatePresence>
              {showRefine && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-6 bg-campiq-surface/30 backdrop-blur-xl border border-campiq-teal/20 shadow-[0_8px_32px_rgba(0,212,160,0.05)] rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-campiq-teal/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                    {/* Stream */}
                    <div className="relative group">
                      <label className="text-[10px] text-campiq-teal uppercase tracking-[0.2em] font-bold mb-2 block ml-1 opacity-80">Stream</label>
                      <div className="relative">
                        <select
                          value={stream}
                          onChange={(e) => setStream(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-campiq-base/50 backdrop-blur-md border border-campiq-border/80 text-campiq-text-primary text-sm hover:border-campiq-teal/50 focus:border-campiq-teal focus:ring-1 focus:ring-campiq-teal outline-none transition-all cursor-pointer appearance-none"
                        >
                          {STREAMS.map(s => <option key={s.value} value={s.value} className="bg-campiq-surface">{s.label}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-campiq-text-muted pointer-events-none group-hover:text-campiq-teal transition-colors" />
                      </div>
                    </div>
                    {/* Budget */}
                    <div className="relative group">
                      <label className="text-[10px] text-campiq-teal uppercase tracking-[0.2em] font-bold mb-2 block ml-1 opacity-80">Max Budget</label>
                      <div className="relative">
                        <select
                          value={budget ?? ''}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-campiq-base/50 backdrop-blur-md border border-campiq-border/80 text-campiq-text-primary text-sm hover:border-campiq-teal/50 focus:border-campiq-teal focus:ring-1 focus:ring-campiq-teal outline-none transition-all cursor-pointer appearance-none"
                        >
                          {BUDGETS.map(b => <option key={b.value} value={b.value} className="bg-campiq-surface">{b.label}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-campiq-text-muted pointer-events-none group-hover:text-campiq-teal transition-colors" />
                      </div>
                    </div>
                    {/* State */}
                    <div className="relative group">
                      <label className="text-[10px] text-campiq-teal uppercase tracking-[0.2em] font-bold mb-2 block ml-1 opacity-80">Location</label>
                      <div className="relative">
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-campiq-base/50 backdrop-blur-md border border-campiq-border/80 text-campiq-text-primary text-sm hover:border-campiq-teal/50 focus:border-campiq-teal focus:ring-1 focus:ring-campiq-teal outline-none transition-all cursor-pointer appearance-none"
                        >
                          <option value="" className="bg-campiq-surface">All India</option>
                          {STATES.filter(Boolean).map(s => <option key={s} value={s} className="bg-campiq-surface">{s}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-campiq-text-muted pointer-events-none group-hover:text-campiq-teal transition-colors" />
                      </div>
                    </div>
                    {/* Re-search */}
                    <div className="flex items-end">
                      <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Searching...</span>
                        ) : (
                          <span className="inline-flex items-center gap-2"><Search size={16} /> Re-search</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-campiq-surface/60 border border-campiq-violet/20 rounded-2xl p-6 mb-10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-campiq-violet" />
                <span className="text-sm font-bold text-campiq-text-primary">AI Analysis</span>
              </div>
              <p className="text-sm text-campiq-text-secondary leading-relaxed">{aiAnalysis}</p>
            </motion.div>
          )}

          {/* Leaderboard Cards */}
          <div className="space-y-5 mb-12">
            {sorted.map((rec: any, idx: number) => {
              const rankIcon = idx === 0 ? <Trophy size={18} className="text-yellow-400" /> :
                               idx === 1 ? <Medal size={18} className="text-gray-300" /> :
                               idx === 2 ? <Medal size={18} className="text-amber-600" /> : null;

              return (
                <motion.div
                  key={rec.college?.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * idx }}
                  className="bg-campiq-surface border border-campiq-border rounded-2xl overflow-hidden hover:border-campiq-teal/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Rank + Match Score sidebar */}
                    <div className="flex lg:flex-col items-center justify-center gap-3 px-6 py-4 lg:py-6 lg:min-w-[100px] bg-campiq-raised/50 border-b lg:border-b-0 lg:border-r border-campiq-border">
                      <div className="flex items-center gap-2">
                        {rankIcon || <span className="text-xl font-bold text-campiq-text-muted">#{idx + 1}</span>}
                        {idx < 3 && <span className="text-xl font-bold text-campiq-text-primary">#{idx + 1}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-campiq-teal/15 border border-campiq-teal/30">
                        <Sparkles size={12} className="text-campiq-teal" />
                        <span className="text-sm font-bold text-campiq-teal">{Math.round(Number(rec.matchScore) * 100)}%</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 lg:p-6">
                      <div className="flex flex-col lg:flex-row gap-5">
                        {/* College Card inline */}
                        {rec.college && (
                          <div className="lg:w-[320px] shrink-0">
                            <CollegeCard college={rec.college} index={idx} />
                          </div>
                        )}
                        {/* AI Reason */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-campiq-violet" />
                            <span className="text-xs font-bold text-campiq-text-muted uppercase tracking-wider">AI Insight</span>
                          </div>
                          <p className="text-sm text-campiq-text-secondary leading-relaxed">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button variant="secondary" onClick={() => { setResults(null); setStep(0); }}>
              <span className="inline-flex items-center gap-2"><RotateCcw size={16} /> Start Over</span>
            </Button>
            <Link href="/explore">
              <Button>
                <span className="inline-flex items-center gap-2"><Search size={16} /> Explore All Colleges</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-campiq-base flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-campiq-surface border-b border-campiq-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  i < step ? 'bg-campiq-teal text-campiq-base' :
                  i === step ? 'bg-campiq-teal/20 text-campiq-teal border-2 border-campiq-teal' :
                  'bg-campiq-raised text-campiq-text-muted'
                }`}>
                  {i < step ? <CheckCircle2 size={16} className="sm:w-5 sm:h-5" /> : i + 1}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${
                  i <= step ? 'text-campiq-text-primary' : 'text-campiq-text-muted'
                }`}>
                  {label}
                </span>
                {i < 3 && <div className={`w-6 sm:w-10 md:w-20 h-[2px] mx-1 sm:mx-2 transition-colors ${i < step ? 'bg-campiq-teal' : 'bg-campiq-border'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Stream */}
            {step === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <GraduationCap size={44} className="text-campiq-teal mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">What do you want to study?</h2>
                  <p className="text-campiq-text-secondary">Choose the field that excites you the most</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {STREAMS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setStream(s.value)}
                      className={`p-5 rounded-xl text-left border transition-all duration-200 ${
                        stream === s.value
                          ? 'bg-campiq-teal/15 border-campiq-teal/50 shadow-[0_0_15px_rgba(0,212,160,0.15)]'
                          : 'bg-campiq-surface border-campiq-border hover:border-campiq-teal/30'
                      }`}
                    >
                      <s.Icon size={24} className={`mb-2 ${stream === s.value ? 'text-campiq-teal' : 'text-campiq-text-muted'}`} />
                      <span className={`text-sm font-semibold block ${stream === s.value ? 'text-campiq-teal' : 'text-campiq-text-primary'}`}>
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Budget */}
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <Wallet size={44} className="text-campiq-amber mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">What&apos;s your budget?</h2>
                  <p className="text-campiq-text-secondary">Annual fees you&apos;re comfortable with</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {BUDGETS.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`p-5 rounded-xl text-left border transition-all duration-200 ${
                        budget === b.value
                          ? 'bg-campiq-amber/15 border-campiq-amber/50 shadow-[0_0_15px_rgba(245,166,35,0.15)]'
                          : 'bg-campiq-surface border-campiq-border hover:border-campiq-amber/30'
                      }`}
                    >
                      <span className={`text-lg font-bold block mb-0.5 ${budget === b.value ? 'text-campiq-amber' : 'text-campiq-text-primary'}`}>
                        {b.label}
                      </span>
                      <span className="text-xs text-campiq-text-muted">{b.description}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Priorities */}
            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <Target size={44} className="text-campiq-violet mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">What matters most?</h2>
                  <p className="text-campiq-text-secondary">Select one or more priorities</p>
                </div>
                <div className="space-y-3">
                  {PRIORITIES.map(p => {
                    const isSelected = priorities.includes(p.value);
                    return (
                      <button
                        key={p.value}
                        onClick={() => togglePriority(p.value)}
                        className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-campiq-violet/10 border-campiq-violet/40 shadow-[0_0_15px_rgba(155,123,255,0.1)]'
                            : 'bg-campiq-surface border-campiq-border hover:border-campiq-violet/30'
                        }`}
                      >
                        <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-campiq-violet/20' : 'bg-campiq-raised'}`}>
                          <p.Icon size={22} className={isSelected ? 'text-campiq-violet' : 'text-campiq-text-muted'} />
                        </div>
                        <div className="flex-1">
                          <span className={`font-semibold text-sm block ${isSelected ? 'text-campiq-violet' : 'text-campiq-text-primary'}`}>
                            {p.label}
                          </span>
                          <span className="text-xs text-campiq-text-muted">{p.description}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={22} className="text-campiq-violet" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Location */}
            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <MapPin size={44} className="text-campiq-teal mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">Any location preference?</h2>
                  <p className="text-campiq-text-secondary">Optional — leave empty to search everywhere</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setState('')}
                    className={`p-4 rounded-xl text-center border transition-all duration-200 ${
                      state === '' ? 'bg-campiq-teal/15 border-campiq-teal/50' : 'bg-campiq-surface border-campiq-border hover:border-campiq-teal/30'
                    }`}
                  >
                    <Globe size={20} className={`mx-auto mb-1 ${state === '' ? 'text-campiq-teal' : 'text-campiq-text-muted'}`} />
                    <span className={`text-sm font-semibold ${state === '' ? 'text-campiq-teal' : 'text-campiq-text-primary'}`}>
                      All India
                    </span>
                  </button>
                  {STATES.filter(Boolean).map(s => (
                    <button
                      key={s}
                      onClick={() => setState(s)}
                      className={`p-4 rounded-xl text-center border transition-all duration-200 ${
                        state === s ? 'bg-campiq-teal/15 border-campiq-teal/50' : 'bg-campiq-surface border-campiq-border hover:border-campiq-teal/30'
                      }`}
                    >
                      <span className={`text-sm font-medium ${state === s ? 'text-campiq-teal' : 'text-campiq-text-primary'}`}>
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <Button
              variant="ghost"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <span className="inline-flex items-center gap-2"><ArrowLeft size={16} /> Back</span>
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                <span className="inline-flex items-center gap-2">Next <ArrowRight size={16} /></span>
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !canProceed()}
                className="bg-gradient-to-r from-campiq-violet to-campiq-teal border-0 text-white min-w-[200px]"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Analyzing...</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><Sparkles size={18} /> Find My Colleges</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
