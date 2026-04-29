import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden';
    
    const variants = {
      primary: 'bg-campiq-teal text-campiq-base hover-shimmer shadow-[0_0_15px_rgba(0,212,160,0.3)]',
      secondary: 'bg-campiq-raised text-campiq-text-primary border border-campiq-border hover:border-campiq-teal/50 hover:bg-campiq-surface',
      ghost: 'bg-transparent text-campiq-text-secondary hover:text-campiq-teal hover:bg-campiq-teal/10'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-14 px-8 text-lg'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <span className={cn(isLoading && 'opacity-0')}>{children as React.ReactNode}</span>
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
