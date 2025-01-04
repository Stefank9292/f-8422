import { create } from 'zustand';

export interface SearchFilters {
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minDuration: string;
  minEngagement: string;
  postsNewerThan: string;
}

interface SearchState {
  username: string;
  numberOfVideos: number;
  selectedDate: Date | undefined;
  filters: SearchFilters;
  setUsername: (username: string) => void;
  setNumberOfVideos: (num: number) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  username: "",
  numberOfVideos: 3,
  selectedDate: undefined,
  filters: {
    minViews: "",
    minPlays: "",
    minLikes: "",
    minComments: "",
    minDuration: "",
    minEngagement: "",
    postsNewerThan: ""
  },
  setUsername: (username) => set({ username }),
  setNumberOfVideos: (numberOfVideos) => set({ numberOfVideos }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({
    filters: {
      minViews: "",
      minPlays: "",
      minLikes: "",
      minComments: "",
      minDuration: "",
      minEngagement: "",
      postsNewerThan: ""
    }
  })
}));