import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, hasNext, hasPrev }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-campiq-teal text-campiq-base shadow-[0_0_10px_rgba(0,212,160,0.4)]" 
                  : "bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
