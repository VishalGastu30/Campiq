// hooks/useFilters.ts
'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export type Filters = {
  search?: string;
  state?: string;
  type?: string;
  stream?: string;
  minFees?: number;
  maxFees?: number;
  sort?: string;
  page?: number;
};

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: Filters = {
    search:   searchParams.get('search') || undefined,
    state:    searchParams.get('state') || undefined,
    type:     searchParams.get('type') || undefined,
    stream:   searchParams.get('stream') || undefined,
    minFees:  searchParams.get('minFees') ? Number(searchParams.get('minFees')) : undefined,
    maxFees:  searchParams.get('maxFees') ? Number(searchParams.get('maxFees')) : undefined,
    sort:     searchParams.get('sort') || 'nirfRank',
    page:     searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const setFilter = useCallback((key: keyof Filters, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    // Reset to page 1 whenever a filter changes (except page itself)
    if (key !== 'page') params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeFilterCount = Object.entries(filters)
    .filter(([key, val]) => val !== undefined && key !== 'sort' && key !== 'page')
    .length;

  return { filters, setFilter, resetFilters, activeFilterCount };
}
