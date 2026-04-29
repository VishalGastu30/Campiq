import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-campiq-text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg bg-campiq-raised border border-campiq-border px-3 py-2 text-sm text-campiq-text-primary placeholder:text-campiq-text-muted transition-colors',
            'focus:outline-none focus:border-campiq-teal focus:ring-1 focus:ring-campiq-teal',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
