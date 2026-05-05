'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, LogOut, Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const { user, logout } = useAuth();
  const { compareIds } = useCompare();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'Compare', href: '/compare', badge: compareIds.length > 0 ? compareIds.length : undefined },
    { name: 'Find My College', href: '/find-my-college' },
  ];

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-campiq-base/80 backdrop-blur-xl border-b border-campiq-border shadow-sm py-3' : 'bg-transparent py-5'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-sig text-white font-bold text-lg shadow-[0_0_15px_rgba(0,212,160,0.4)]">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-campiq-text-primary">
              Campiq<span className="text-campiq-teal">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  pathname === link.href ? 'text-campiq-teal' : 'text-campiq-text-secondary hover:text-campiq-text-primary'
                )}
              >
                {link.name}
                {link.badge && (
                  <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-campiq-violet text-[10px] text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-campiq-raised p-1.5 rounded-full pl-3 transition-colors border border-transparent hover:border-campiq-border"
                >
                  <span className="text-sm font-medium text-campiq-text-primary">{user.name.split(' ')[0]}</span>
                  <div className="h-8 w-8 rounded-full bg-campiq-raised flex items-center justify-center text-campiq-teal border border-campiq-border">
                    <UserIcon size={16} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-campiq-surface border border-campiq-border shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-campiq-border">
                          <p className="text-sm text-campiq-text-primary font-medium truncate">{user.name}</p>
                          <p className="text-xs text-campiq-text-muted truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link href="/saved" className="flex items-center gap-2 px-3 py-2 text-sm text-campiq-text-secondary hover:text-campiq-text-primary hover:bg-campiq-raised rounded-lg transition-colors">
                            <Bookmark size={16} /> Saved Colleges
                          </Link>
                          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors mt-1">
                            <LogOut size={16} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-campiq-text-secondary hover:text-campiq-text-primary transition-colors">
                  Log in
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-campiq-text-secondary hover:text-campiq-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-campiq-border bg-campiq-base overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    'text-lg font-medium py-2 border-b border-campiq-border/50 flex justify-between items-center',
                    pathname === link.href ? 'text-campiq-teal' : 'text-campiq-text-secondary'
                  )}
                >
                  {link.name}
                  {link.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-campiq-violet text-xs text-white font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link href="/saved" className="text-lg font-medium py-2 border-b border-campiq-border/50 text-campiq-text-secondary">
                    Saved Colleges
                  </Link>
                  <button onClick={logout} className="text-lg font-medium py-2 text-left text-red-400">
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link href="/auth/login">
                    <Button variant="secondary" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
