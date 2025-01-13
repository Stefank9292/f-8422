import { usePlatformStore } from '@/store/platformStore';
import { useSearchStore } from '@/store/searchStore';
import { useCallback } from 'react';

export const usePlatformState = () => {
  const { platform } = usePlatformStore();
  const {
    instagramUsername,
    tiktokUsername,
    setInstagramUsername,
    setTiktokUsername,
  } = useSearchStore();

  const currentUsername = platform === 'instagram' ? instagramUsername : tiktokUsername;
  const setUsername = useCallback((username: string) => {
    if (platform === 'instagram') {
      setInstagramUsername(username);
    } else {
      setTiktokUsername(username);
    }
  }, [platform, setInstagramUsername, setTiktokUsername]);

  return {
    platform,
    currentUsername,
    setUsername,
  };
};