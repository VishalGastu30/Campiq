// store/compareStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CollegeSummary {
  id: string;
  slug: string;
  name: string;
  city: string;
  nirfRank?: number | null;
  minFees?: number | null;
  placementPercent?: number | null;
  imageUrl?: string | null;
}

interface CompareStore {
  selected: CollegeSummary[];
  add: (college: CollegeSummary) => void;
  remove: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  canAdd: () => boolean; // max 3
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selected: [],
      
      add: (college) => {
        if (get().selected.length >= 3) return; // Hard cap at 3
        if (get().isSelected(college.id)) return; // Already in list
        set((state) => ({ selected: [...state.selected, college] }));
      },
      
      remove: (id) => set((state) => ({
        selected: state.selected.filter(c => c.id !== id)
      })),
      
      clear: () => set({ selected: [] }),
      
      isSelected: (id) => get().selected.some(c => c.id === id),
      
      canAdd: () => get().selected.length < 3,
    }),
    {
      name: 'campiq-compare', // localStorage key
    }
  )
);
