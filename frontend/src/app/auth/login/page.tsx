'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Wait a tiny bit for toast
      setTimeout(() => {
        window.location.href = redirect;
      }, 500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to login');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dynamic Graphic */}
      <div className="hidden lg:flex w-1/2 relative bg-campiq-surface border-r border-campiq-border overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-campiq-teal/20 rounded-full blur-[100px] animate-orb-drift" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-campiq-violet/10 rounded-full blur-[120px] animate-orb-drift" style={{ animationDelay: '-5s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgoJPC9zdmc+')] opacity-50" />
        </div>
        <div className="relative z-10 w-full max-w-lg text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-sig text-white font-bold text-3xl shadow-[0_0_30px_rgba(0,212,160,0.4)] mb-8">
            C
          </div>
          <h2 className="text-4xl font-bold text-campiq-text-primary mb-6 leading-tight">
            Discover your path <br/>to the perfect college.
          </h2>
          <p className="text-lg text-campiq-text-secondary">
            Join thousands of students making smarter, data-driven decisions about their future.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-12 relative bg-campiq-base">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-sig text-white font-bold text-2xl shadow-[0_0_25px_rgba(0,212,160,0.3)] mb-6">
              C
            </div>
            <h1 className="text-3xl font-bold text-campiq-text-primary">Welcome back</h1>
            <p className="text-campiq-text-secondary mt-2">Sign in to your account to continue</p>
          </div>

          <Card className="p-6 sm:p-8 bg-campiq-surface/50 backdrop-blur-xl border-campiq-border shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-campiq-text-primary">Password</label>
                  <a href="#" className="text-xs text-campiq-teal hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
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
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" isLoading={isSubmitting}>
                Sign in
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-campiq-border/50 text-center">
              <p className="text-sm text-campiq-text-secondary">
                Don't have an account?{' '}
                <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-campiq-teal font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-campiq-teal">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
