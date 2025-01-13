import { create } from 'zustand';

interface SearchFilters {
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
  postsNewerThan: string;
  minShares: string; // Added this field
}

interface SearchState {
  instagramUsername: string;
  tiktokUsername: string;
  numberOfVideos: number;
  selectedDate: Date | undefined;
  dateRange: string;
  location: string;
  filters: SearchFilters;
  setInstagramUsername: (username: string) => void;
  setTiktokUsername: (username: string) => void;
  setNumberOfVideos: (num: number) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setDateRange: (range: string) => void;
  setLocation: (location: string) => void;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  instagramUsername: "",
  tiktokUsername: "",
  numberOfVideos: 3,
  selectedDate: undefined,
  dateRange: "DEFAULT",
  location: "US",
  filters: {
    minViews: "",
    minPlays: "",
    minLikes: "",
    minComments: "",
    minEngagement: "",
    postsNewerThan: "",
    minShares: "" // Added this field with default empty string
  },
  setInstagramUsername: (instagramUsername) => set({ instagramUsername }),
  setTiktokUsername: (tiktokUsername) => set({ tiktokUsername }),
  setNumberOfVideos: (numberOfVideos) => set({ numberOfVideos }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setDateRange: (dateRange) => set({ dateRange }),
  setLocation: (location) => set({ location }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({
    filters: {
      minViews: "",
      minPlays: "",
      minLikes: "",
      minComments: "",
      minEngagement: "",
      postsNewerThan: "",
      minShares: "" // Added this field
    }
  })
}));