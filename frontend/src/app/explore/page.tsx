'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, CollegeQueryParams } from '@/lib/api';
import { College, FilterMeta } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/explore/SearchBar';
import { FilterPanel } from '@/components/explore/FilterPanel';
import { CollegeGrid } from '@/components/explore/CollegeGrid';
import { Pagination } from '@/components/explore/Pagination';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');
  const [filters, setFilters] = useState({
    state: searchParams.get('state') || '',
    type: searchParams.get('type') || 'All',
    minFees: parseInt(searchParams.get('minFees') || '0', 10),
    maxFees: parseInt(searchParams.get('maxFees') || '1000000', 10),
    course: searchParams.get('course') || ''
  });
  
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filterMeta, setFilterMeta] = useState<FilterMeta | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Track previous filter/search values to reset page only when they change
  const prevDepsRef = useRef({ debouncedSearch, sortBy, filters });
  const fetchAbortRef = useRef<AbortController | null>(null);

  // Fetch filter metadata once
  useEffect(() => {
    api.colleges.getFilterMeta().then(setFilterMeta).catch(() => {});
  }, []);

  // Single unified fetch effect — handles page reset + data fetch in one pass
  useEffect(() => {
    const prev = prevDepsRef.current;
    const filtersChanged = prev.debouncedSearch !== debouncedSearch 
      || prev.sortBy !== sortBy 
      || prev.filters !== filters;
    
    // Reset page to 1 when filters/search/sort changes (not when page itself changes)
    const effectivePage = filtersChanged ? 1 : page;
    if (filtersChanged && page !== 1) {
      setPage(1);
      prevDepsRef.current = { debouncedSearch, sortBy, filters };
      return; // The setPage(1) will re-trigger this effect with page=1
    }
    prevDepsRef.current = { debouncedSearch, sortBy, filters };

    // Sync to URL
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (sortBy !== 'rating') params.set('sortBy', sortBy);
    if (filters.state) params.set('state', filters.state);
    if (filters.type !== 'All') params.set('type', filters.type);
    if (filters.minFees > 0) params.set('minFees', filters.minFees.toString());
    if (filters.maxFees < 1000000) params.set('maxFees', filters.maxFees.toString());
    if (filters.course) params.set('course', filters.course);
    if (effectivePage > 1) params.set('page', effectivePage.toString());
    
    router.replace(`/explore?${params.toString()}`, { scroll: false });

    // Cancel any in-flight request
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }
    const abortController = new AbortController();
    fetchAbortRef.current = abortController;

    const fetchColleges = async () => {
      setIsLoading(true);
      try {
        const params: CollegeQueryParams = {
          search: debouncedSearch,
          sortBy: sortBy as any,
          page: effectivePage,
          limit: 12,
          state: filters.state || undefined,
          type: filters.type !== 'All' ? filters.type : undefined,
          minFees: filters.minFees,
          maxFees: filters.maxFees,
          course: filters.course || undefined
        };
        
        const res = await api.colleges.getAll(params);
        if (!abortController.signal.aborted) {
          setColleges(res.data);
          setTotal(res.total);
          setTotalPages(res.totalPages);
          setHasNext(res.hasNext);
          setHasPrev(res.hasPrev);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Failed to fetch colleges', err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchColleges();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => { abortController.abort(); };
  }, [debouncedSearch, sortBy, page, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-campiq-text-primary mb-3">Explore Colleges</h1>
        <p className="text-campiq-text-secondary">Find and compare the best colleges tailored to your goals.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <FilterPanel meta={filterMeta} filters={filters} setFilters={setFilters} />
        </aside>

        {/* Mobile Filter Button */}
        <div className="md:hidden w-full flex justify-end -mb-4">
          <Button variant="secondary" onClick={() => setShowMobileFilters(true)} className="w-full">
            <SlidersHorizontal size={18} className="mr-2" />
            Filters {Object.values(filters).some(v => v !== '' && v !== 'All' && v !== 0 && v !== 1000000) && '(Active)'}
          </Button>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-campiq-base z-50 md:hidden"
              >
                <FilterPanel meta={filterMeta} filters={filters} setFilters={setFilters} onCloseMobile={() => setShowMobileFilters(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalResults={total}
          />
          
          <CollegeGrid colleges={colleges} isLoading={isLoading} />
          
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </main>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-campiq-teal">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
