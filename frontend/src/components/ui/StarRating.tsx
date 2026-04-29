import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // e.g. 4.3
  maxStars?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, maxStars = 5, className, size = 'md' }: StarRatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(maxStars)].map((_, i) => {
        const fillPercentage = Math.max(0, Math.min(1, rating - i));
        
        return (
          <div key={i} className="relative">
            <Star className={cn('text-campiq-raised', sizes[size])} strokeWidth={1} fill="currentColor" />
            
            {fillPercentage > 0 && (
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <Star className={cn('text-campiq-amber', sizes[size])} fill="currentColor" />
              </div>
            )}
          </div>
        );
      })}
      <span className={cn('ml-1.5 font-medium text-campiq-text-primary', 
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
      )}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
