import { useSearchStateStore } from '@/store/searchStateStore';
import { useSearchStore } from '@/store/searchStore';
import { usePlatformStore } from '@/store/platformStore';
import { useSearchSession } from '@/hooks/useSearchSession';
import { useSearch } from '@/hooks/useSearch';

export const useSearchState = () => {
  const {
    instagramUsername,
    tiktokUsername,
    numberOfVideos,
    selectedDate,
    dateRange,
    location,
  } = useSearchStore();
  
  const { platform } = usePlatformStore();
  const currentUsername = platform === 'instagram' ? instagramUsername : tiktokUsername;
  
  const {
    session,
    maxRequests,
    requestCount,
    hasReachedLimit,
    isProUser,
    isSteroidsUser,
    subscriptionStatus
  } = useSearchSession();

  const {
    posts,
    isLoading,
    isBulkSearching,
    handleSearch,
    handleBulkSearch,
  } = useSearch({
    platform,
    currentUsername,
    numberOfVideos,
    selectedDate,
    dateRange,
    location,
    requestCount,
    maxRequests,
    isProUser,
    isSteroidsUser,
    subscriptionStatus
  });

  return {
    username: currentUsername,
    isLoading,
    isBulkSearching,
    hasReachedLimit,
    requestCount,
    maxRequests,
    handleSearch,
    handleBulkSearch,
    displayPosts: posts,
    subscriptionStatus,
  };
};