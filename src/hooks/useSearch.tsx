import { useState } from "react";
import { useSearchQuery } from "./search/useSearchQuery";
import { useBulkSearch } from "./search/useBulkSearch";
import { useSearchValidation } from "./search/useSearchValidation";
import { useToast } from "./use-toast";

interface UseSearchProps {
  platform: string;
  currentUsername: string;
  numberOfVideos: number;
  selectedDate?: Date;
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
  const { toast } = useToast();
  
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

  const {
    isBulkSearching,
    bulkSearchResults,
    handleBulkSearch
  } = useBulkSearch({
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
    if (!validateSearch()) {
      return;
    }
    setShouldFetch(true);
  };

  if (error) {
    toast({
      title: "Search Failed",
      description: error.message || "Failed to fetch posts",
      variant: "destructive",
    });
    setShouldFetch(false);
  }

  return {
    posts: bulkSearchResults.length > 0 ? bulkSearchResults : posts,
    isLoading,
    isBulkSearching,
    handleSearch,
    handleBulkSearch,
  };
};