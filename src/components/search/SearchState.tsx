import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchStore } from "../../store/searchStore";
import { useBasicSearch } from "@/hooks/search/useBasicSearch";
import { useBulkSearch } from "@/hooks/search/useBulkSearch";
import { useSearchValidation } from "@/hooks/search/useSearchValidation";
import { useUsageStats } from "@/hooks/useUsageStats";

export const useSearchState = () => {
  const {
    username,
    numberOfVideos,
    selectedDate,
  } = useSearchStore();
  
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const {
    maxRequests,
    usedRequests: requestCount,
    hasReachedLimit,
    subscriptionStatus
  } = useUsageStats(session);

  const { validateSearch } = useSearchValidation(requestCount, maxRequests, subscriptionStatus);

  const { isBulkSearching, bulkSearchResults, handleBulkSearch } = useBulkSearch(
    requestCount,
    maxRequests,
    subscriptionStatus,
    setShouldFetch
  );

  const { data: posts = [], isLoading } = useBasicSearch(
    username,
    numberOfVideos,
    selectedDate,
    shouldFetch,
    isBulkSearching,
    requestCount,
    maxRequests,
    subscriptionStatus,
    setShouldFetch
  );

  const handleSearch = () => {
    if (isLoading || isBulkSearching) {
      return;
    }

    if (!validateSearch(username)) {
      return;
    }

    // Reset any existing results before new search
    setBulkSearchResults([]);
    setShouldFetch(true);
  };

  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : posts;

  return {
    username,
    isLoading,
    isBulkSearching,
    hasReachedLimit,
    requestCount,
    maxRequests,
    handleSearch,
    handleBulkSearch,
    displayPosts,
    subscriptionStatus,
  };
};