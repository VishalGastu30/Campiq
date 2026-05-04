import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, CollegeQueryParams } from '../lib/api';

export function useColleges(params: CollegeQueryParams) {
  return useQuery({
    queryKey: ['colleges', params],
    queryFn: () => api.colleges.getAll(params),
  });
}

export function useCollege(slug: string) {
  return useQuery({
    queryKey: ['college', slug],
    queryFn: () => api.colleges.getById(slug),
    enabled: !!slug,
  });
}

export function useFilterMeta() {
  return useQuery({
    queryKey: ['filterMeta'],
    queryFn: () => api.colleges.getFilterMeta(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSavedColleges() {
  return useQuery({
    queryKey: ['savedColleges'],
    queryFn: () => api.saved.getAll(),
  });
}

export function useSaveCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collegeId: string) => api.saved.save(undefined, collegeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedColleges'] });
    },
  });
}

export function useRemoveSavedCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collegeId: string) => api.saved.remove(undefined, collegeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedColleges'] });
    },
  });
}
