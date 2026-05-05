import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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

  // Calculate sliding window of 5 pages
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Adjust start page if we are near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
        title="First Page"
      >
        <ChevronsLeft size={20} />
      </button>

      {/* Prev Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
        title="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page) => {
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

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
        title="Next Page"
      >
        <ChevronRight size={20} />
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-campiq-surface border border-campiq-border text-campiq-text-primary hover:bg-campiq-raised hover:border-campiq-teal/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
        title="Last Page"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}
