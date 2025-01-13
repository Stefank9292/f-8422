import { create } from 'zustand';

interface PlatformState {
  platform: 'instagram' | 'tiktok';
  setPlatform: (platform: 'instagram' | 'tiktok') => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  platform: 'instagram',
  setPlatform: (platform) => set({ platform }),
}));