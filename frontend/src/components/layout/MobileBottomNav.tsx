'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, GitCompareArrows, Sparkles, Bookmark } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/find-my-college', icon: Sparkles, label: 'AI Match' },
  { href: '/compare', icon: GitCompareArrows, label: 'Compare' },
  { href: '/saved', icon: Bookmark, label: 'Saved' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { compareIds } = useCompare();
  const { user } = useAuth();

  // Don't show on auth pages
  if (pathname.startsWith('/auth')) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-campiq-base/90 backdrop-blur-xl border-t border-campiq-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const badge = item.href === '/compare' && compareIds.length > 0 ? compareIds.length : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full relative transition-colors',
                isActive ? 'text-campiq-teal' : 'text-campiq-text-muted'
              )}
            >
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {badge && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-campiq-violet text-[9px] text-white font-bold">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-campiq-teal rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
