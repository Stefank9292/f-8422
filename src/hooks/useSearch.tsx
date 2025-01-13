import { useSearchQuery } from "@/hooks/search/useSearchQuery";
import { useBulkSearch } from "@/hooks/search/useBulkSearch";
import { useSearchValidation } from "@/hooks/search/useSearchValidation";
import { useSubscriptionLimits } from "@/hooks/search/useSubscriptionLimits";
import { useRequestCount } from "@/hooks/useRequestCount";
import { Session } from "@supabase/supabase-js";

interface UseSearchProps {
  platform: string;
  currentUsername: string;
  numberOfVideos: number;
  selectedDate: Date | undefined;
  dateRange: string;
  location: string;
  requestCount: number;
  maxRequests: number;
  isProUser: boolean;
  isSteroidsUser: boolean;
  subscriptionStatus: any;
}

export const useSearch = ({
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
}: UseSearchProps) => {
  const {
    posts,
    isLoading,
    error,
    setShouldFetch,
    maxVideosPerSearch
  } = useSearchQuery({
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

  const { isBulkSearching, handleBulkSearch } = useBulkSearch({
    maxVideosPerSearch,
    isProUser,
    isSteroidsUser,
    requestCount,
    maxRequests
  });

  const { validateSearch } = useSearchValidation({
    currentUsername,
    requestCount,
    maxRequests,
    subscriptionStatus,
    isLoading,
    isBulkSearching
  });

  const handleSearch = () => {
    if (validateSearch()) {
      setShouldFetch(true);
    }
  };

  return {
    posts,
    isLoading,
    error,
    isBulkSearching,
    handleSearch,
    handleBulkSearch,
  };
};