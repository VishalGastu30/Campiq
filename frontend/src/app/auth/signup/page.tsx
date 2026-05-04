'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'bg-campiq-border', text: '' };
    if (password.length < 6) return { width: '33%', color: 'bg-red-500', text: 'Weak' };
    if (password.length < 10) return { width: '66%', color: 'bg-campiq-amber', text: 'Medium' };
    return { width: '100%', color: 'bg-campiq-teal', text: 'Strong' };
  };
  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      setTimeout(() => {
        window.location.href = redirect;
      }, 500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right Side - Dynamic Graphic */}
      <div className="hidden lg:flex w-1/2 relative bg-campiq-surface border-l border-campiq-border overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-campiq-violet/20 rounded-full blur-[100px] animate-orb-drift" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-campiq-teal/10 rounded-full blur-[120px] animate-orb-drift" style={{ animationDelay: '-5s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgoJPC9zdmc+')] opacity-50" />
        </div>
        <div className="relative z-10 w-full max-w-lg text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-sig text-white font-bold text-3xl shadow-[0_0_30px_rgba(155,123,255,0.4)] mb-8">
            C
          </div>
          <h2 className="text-4xl font-bold text-campiq-text-primary mb-6 leading-tight">
            Start your journey <br/>with Campiq.
          </h2>
          <p className="text-lg text-campiq-text-secondary">
            Create an account to save colleges, compare options, and find the perfect institution for your future.
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-12 relative bg-campiq-base">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10 py-12"
        >
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-sig text-white font-bold text-2xl shadow-[0_0_25px_rgba(155,123,255,0.3)] mb-6">
              C
            </div>
            <h1 className="text-3xl font-bold text-campiq-text-primary">Create an account</h1>
            <p className="text-campiq-text-secondary mt-2">Join Campiq to save and compare colleges</p>
          </div>

          <Card className="p-6 sm:p-8 bg-campiq-surface/50 backdrop-blur-xl border-campiq-border shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-campiq-text-primary">Full Name</label>
                <Input 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<UserIcon size={18} />}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-campiq-text-primary">Email</label>
                <Input 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-campiq-text-primary">Password</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-campiq-text-muted hover:text-campiq-text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="pt-2">
                    <div className="h-1 w-full bg-campiq-raised rounded-full overflow-hidden flex">
                      <motion.div 
                        className={`h-full ${strength.color}`} 
                        initial={{ width: '0%' }}
                        animate={{ width: strength.width }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.text} password
                    </p>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" isLoading={isSubmitting}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-campiq-border/50 text-center">
              <p className="text-sm text-campiq-text-secondary">
                Already have an account?{' '}
                <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-campiq-teal font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-campiq-teal">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
