import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'teal' | 'amber' | 'violet' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    teal: 'bg-campiq-teal/10 text-campiq-teal border-campiq-teal/20',
    amber: 'bg-campiq-amber/10 text-campiq-amber border-campiq-amber/20',
    violet: 'bg-campiq-violet/10 text-campiq-violet border-campiq-violet/20',
    default: 'bg-campiq-raised text-campiq-text-secondary border-campiq-border'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
