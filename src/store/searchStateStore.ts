import { create } from 'zustand';
import { FilterState } from '@/utils/filterResults';

interface SearchState {
  searchResults: any[];
  isLoading: boolean;
  isBulkSearching: boolean;
  error: Error | null;
  setSearchResults: (results: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsBulkSearching: (isBulkSearching: boolean) => void;
  setError: (error: Error | null) => void;
  resetSearchState: () => void;
}

export const useSearchStateStore = create<SearchState>((set) => ({
  searchResults: [],
  isLoading: false,
  isBulkSearching: false,
  error: null,
  setSearchResults: (results) => set({ searchResults: results }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsBulkSearching: (isBulkSearching) => set({ isBulkSearching }),
  setError: (error) => set({ error }),
  resetSearchState: () => set({
    searchResults: [],
    isLoading: false,
    isBulkSearching: false,
    error: null,
  }),
}));