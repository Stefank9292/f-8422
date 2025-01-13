import { create } from 'zustand';
import { LocationOption } from '@/types/tiktok';

interface TikTokFilters {
  minViews: string;
  minShares: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
  postsNewerThan: string;
}

interface TikTokSearchState {
  username: string;
  numberOfVideos: number;
  selectedDate: Date | undefined;
  selectedLocation: string;
  filters: TikTokFilters;
  setUsername: (username: string) => void;
  setNumberOfVideos: (num: number) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedLocation: (location: string) => void;
  setFilters: (filters: TikTokFilters) => void;
  resetFilters: () => void;
}

export const LOCATION_OPTIONS: LocationOption[] = [
  { label: 'United States', value: 'US' },
  { label: 'Germany', value: 'DE' }
];

export const useTikTokSearchStore = create<TikTokSearchState>((set) => ({
  username: "",
  numberOfVideos: 3,
  selectedDate: undefined,
  selectedLocation: "US",
  filters: {
    minViews: "",
    minShares: "",
    minLikes: "",
    minComments: "",
    minEngagement: "",
    postsNewerThan: ""
  },
  setUsername: (username) => set({ username }),
  setNumberOfVideos: (numberOfVideos) => set({ numberOfVideos }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({
    filters: {
      minViews: "",
      minShares: "",
      minLikes: "",
      minComments: "",
      minEngagement: "",
      postsNewerThan: ""
    }
  })
}));