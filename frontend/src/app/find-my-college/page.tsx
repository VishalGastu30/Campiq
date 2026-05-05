'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CollegeCard } from '@/components/explore/CollegeCard';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, MapPin,
  GraduationCap, Wallet, Target, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STREAMS = [
  { value: 'ENGINEERING', label: 'Engineering', icon: '⚙️' },
  { value: 'MANAGEMENT', label: 'Management', icon: '📊' },
  { value: 'MEDICAL', label: 'Medical', icon: '🏥' },
  { value: 'LAW', label: 'Law', icon: '⚖️' },
  { value: 'ARTS', label: 'Arts', icon: '🎨' },
  { value: 'SCIENCE', label: 'Science', icon: '🔬' },
  { value: 'COMMERCE', label: 'Commerce', icon: '💼' },
  { value: 'DESIGN', label: 'Design', icon: '✏️' },
  { value: 'PHARMACY', label: 'Pharmacy', icon: '💊' },
  { value: 'AGRICULTURE', label: 'Agriculture', icon: '🌾' },
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
  { value: 'placements', label: 'High Placements', icon: Target, description: 'Best ROI and career outcomes' },
  { value: 'fees', label: 'Low Fees', icon: Wallet, description: 'Affordable without compromise' },
  { value: 'ranking', label: 'Top Ranking', icon: GraduationCap, description: 'NIRF-ranked prestige colleges' },
  { value: 'research', label: 'Research Focus', icon: Sparkles, description: 'Strong R&D and publications' },
  { value: 'campus', label: 'Campus & Life', icon: MapPin, description: 'Facilities, hostel, culture' },
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

  if (results) {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {results.map((rec: any, idx: number) => (
              <motion.div
                key={rec.college?.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex flex-col gap-4"
              >
                <div className="bg-campiq-teal/10 border border-campiq-teal/20 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-campiq-teal/20 rounded-full blur-xl" />
                  <span className="text-sm font-bold text-campiq-teal flex items-center gap-1.5 mb-2">
                    <Sparkles size={14} /> {rec.matchScore}% Match
                  </span>
                  <p className="text-sm text-campiq-text-primary leading-relaxed">{rec.reason}</p>
                </div>
                {rec.college && (
                  <div className="flex-1">
                    <CollegeCard college={rec.college} index={idx} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => { setResults(null); setStep(0); }}>
              <ArrowLeft size={16} className="mr-2" /> Start Over
            </Button>
            <Link href="/explore">
              <Button>Explore All Colleges</Button>
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
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step ? 'bg-campiq-teal text-campiq-base' :
                  i === step ? 'bg-campiq-teal/20 text-campiq-teal border border-campiq-teal' :
                  'bg-campiq-raised text-campiq-text-muted'
                }`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  i <= step ? 'text-campiq-text-primary' : 'text-campiq-text-muted'
                }`}>
                  {label}
                </span>
                {i < 3 && <div className={`w-8 sm:w-16 h-[2px] mx-2 transition-colors ${i < step ? 'bg-campiq-teal' : 'bg-campiq-border'}`} />}
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
                <div className="text-center mb-8">
                  <GraduationCap size={40} className="text-campiq-teal mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">What do you want to study?</h2>
                  <p className="text-campiq-text-secondary">Choose the field that excites you the most</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STREAMS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setStream(s.value)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                        stream === s.value
                          ? 'bg-campiq-teal/15 border-campiq-teal/50 shadow-[0_0_15px_rgba(0,212,160,0.15)]'
                          : 'bg-campiq-surface border-campiq-border hover:border-campiq-teal/30'
                      }`}
                    >
                      <span className="text-xl mb-1 block">{s.icon}</span>
                      <span className={`text-sm font-semibold ${stream === s.value ? 'text-campiq-teal' : 'text-campiq-text-primary'}`}>
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
                <div className="text-center mb-8">
                  <Wallet size={40} className="text-campiq-amber mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">What's your budget?</h2>
                  <p className="text-campiq-text-secondary">Annual fees you're comfortable with</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUDGETS.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ${
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
                <div className="text-center mb-8">
                  <Target size={40} className="text-campiq-violet mx-auto mb-4" />
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
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-campiq-violet/10 border-campiq-violet/40 shadow-[0_0_15px_rgba(155,123,255,0.1)]'
                            : 'bg-campiq-surface border-campiq-border hover:border-campiq-violet/30'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-campiq-violet/20' : 'bg-campiq-raised'}`}>
                          <p.icon size={20} className={isSelected ? 'text-campiq-violet' : 'text-campiq-text-muted'} />
                        </div>
                        <div className="flex-1">
                          <span className={`font-semibold text-sm block ${isSelected ? 'text-campiq-violet' : 'text-campiq-text-primary'}`}>
                            {p.label}
                          </span>
                          <span className="text-xs text-campiq-text-muted">{p.description}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={20} className="text-campiq-violet" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Location */}
            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <MapPin size={40} className="text-campiq-teal mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-campiq-text-primary mb-2">Any location preference?</h2>
                  <p className="text-campiq-text-secondary">Optional — leave empty to search everywhere</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setState('')}
                    className={`p-4 rounded-xl text-center border transition-all duration-200 ${
                      state === '' ? 'bg-campiq-teal/15 border-campiq-teal/50' : 'bg-campiq-surface border-campiq-border hover:border-campiq-teal/30'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${state === '' ? 'text-campiq-teal' : 'text-campiq-text-primary'}`}>
                      🌍 All India
                    </span>
                  </button>
                  {STATES.filter(Boolean).map(s => (
                    <button
                      key={s}
                      onClick={() => setState(s)}
                      className={`p-3 rounded-xl text-center border transition-all duration-200 ${
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
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Next <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !canProceed()}
                className="bg-gradient-to-r from-campiq-violet to-campiq-teal border-0 text-white min-w-[200px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Analyzing...</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles size={18} /> Find My Colleges</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
