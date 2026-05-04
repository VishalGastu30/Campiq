import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CollegeCard } from '../explore/CollegeCard';
import toast from 'react-hot-toast';

interface AiRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiRecommenderModal({ isOpen, onClose }: AiRecommenderModalProps) {
  const { token, user } = useAuth();
  const [stream, setStream] = useState('');
  const [budget, setBudget] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      toast.error('Please login to use AI recommendations');
      return;
    }
    if (!stream || !budget || priorities.length === 0) {
      toast.error('Please fill all fields and select at least one priority');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.ai.recommend(token, { stream, budget: parseInt(budget, 10), priority: priorities });
      setRecommendations(res.recommendations);
    } catch (e: any) {
      toast.error(e.message || 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-campiq-base border border-campiq-border rounded-3xl shadow-2xl z-10 custom-scrollbar"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-campiq-border bg-campiq-base/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-campiq-teal/10 flex items-center justify-center border border-campiq-teal/20">
                <Sparkles className="text-campiq-teal w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-campiq-text-primary">AI Counselor</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-campiq-text-muted hover:text-campiq-text-primary hover:bg-campiq-raised transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {recommendations.length === 0 ? (
              <form onSubmit={handleRecommend} className="max-w-xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-campiq-text-primary mb-2">Find Your Perfect Match</h3>
                  <p className="text-campiq-text-secondary">Tell us what you're looking for, and our AI will analyze thousands of data points to find your ideal college.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-campiq-text-secondary mb-1">What stream are you interested in?</label>
                    <Select 
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      options={[
                        { label: 'Select a stream', value: '' },
                        { label: 'Engineering', value: 'ENGINEERING' },
                        { label: 'Management', value: 'MANAGEMENT' },
                        { label: 'Medical', value: 'MEDICAL' },
                        { label: 'Law', value: 'LAW' },
                        { label: 'Arts', value: 'ARTS' },
                        { label: 'Science', value: 'SCIENCE' },
                        { label: 'Commerce', value: 'COMMERCE' },
                        { label: 'Design', value: 'DESIGN' },
                        { label: 'Pharmacy', value: 'PHARMACY' },
                        { label: 'Agriculture', value: 'AGRICULTURE' },
                      ]}
                      className="h-12 w-full text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-campiq-text-secondary mb-1">What is your total budget for the course?</label>
                    <Select 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      options={[
                        { label: 'Select budget limit', value: '' },
                        { label: 'Under ₹2 Lakhs', value: '200000' },
                        { label: 'Under ₹5 Lakhs', value: '500000' },
                        { label: 'Under ₹10 Lakhs', value: '1000000' },
                        { label: 'Under ₹15 Lakhs', value: '1500000' },
                        { label: 'Under ₹25 Lakhs', value: '2500000' },
                        { label: 'No constraint', value: '0' },
                      ]}
                      className="h-12 w-full text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-campiq-text-secondary mb-3">What are your top priorities? (Select one or more)</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'High Placements', value: 'placements' },
                        { label: 'Low Fees', value: 'fees' },
                        { label: 'Top Ranking / Prestige', value: 'ranking' },
                        { label: 'Research & Academics', value: 'research' },
                        { label: 'Campus Life & Facilities', value: 'campus' },
                      ].map(opt => {
                        const isSelected = priorities.includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setPriorities(prev => 
                                prev.includes(opt.value) 
                                  ? prev.filter(p => p !== opt.value) 
                                  : [...prev, opt.value]
                              );
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                              isSelected 
                                ? 'bg-campiq-teal/15 text-campiq-teal border-campiq-teal shadow-[0_0_10px_rgba(0,212,160,0.2)]' 
                                : 'bg-campiq-raised text-campiq-text-secondary border-transparent hover:border-campiq-border hover:bg-campiq-surface'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg mt-8" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Analyzing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Sparkles size={20} /> Get AI Recommendations</span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-campiq-text-primary">Top 3 Matches Found</h3>
                  <Button variant="secondary" onClick={() => setRecommendations([])} size="sm">Modify Search</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((rec, idx) => (
                    <div key={rec.college.id} className="flex flex-col space-y-4">
                      <div className="bg-campiq-teal/10 border border-campiq-teal/20 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-campiq-teal/20 rounded-full blur-xl" />
                        <span className="text-sm font-bold text-campiq-teal flex items-center gap-1.5">
                          <Sparkles size={14} /> {rec.matchScore}% Match
                        </span>
                        <p className="text-sm text-campiq-text-primary leading-relaxed">{rec.reason}</p>
                      </div>
                      <div className="flex-1">
                        <CollegeCard college={rec.college} index={idx} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
