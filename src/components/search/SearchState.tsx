import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/services/apifyService";
import { supabase } from "@/integrations/supabase/client";
import { useSearchStore } from "../../store/searchStore";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/utils/instagram/types/InstagramTypes";
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";
import { useRequestCount } from "@/hooks/useRequestCount";

export const useSearchState = () => {
  const {
    username,
    numberOfVideos,
    selectedDate,
  } = useSearchStore();
  
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<InstagramPost[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { maxRequests, subscriptionStatus } = useSubscriptionLimits(session);
  const requestCount = useRequestCount(session);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: async () => {
      console.log('Fetching Instagram posts for:', username);
      const results = await fetchInstagramPosts(username, numberOfVideos, selectedDate);
      
      if (results.length > 0) {
        await saveSearchHistory(username, results);
      }
      
      return results;
    },
    enabled: shouldFetch && !!username && !isBulkSearching,
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      onError: (error: Error) => {
        console.error('Search error:', error);
        toast({
          title: "Search Failed",
          description: error.message || "Failed to fetch Instagram posts",
          variant: "destructive",
        });
        setShouldFetch(false);
      }
    },
  });

  const handleSearch = () => {
    if (isLoading || isBulkSearching) {
      return;
    }

    if (!username) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    if (requestCount >= maxRequests) {
      toast({
        title: "Monthly Limit Reached",
        description: `You've reached your monthly limit of ${maxRequests} searches.`,
        variant: "destructive",
      });
      return;
    }

    // Reset any existing results before new search
    queryClient.removeQueries({ queryKey: ['instagram-posts'] });
    setBulkSearchResults([]);
    setShouldFetch(true);
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    setIsBulkSearching(true);
    try {
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      
      // Group results by username and save to search history
      const resultsByUsername = new Map<string, InstagramPost[]>();
      
      results.forEach(post => {
        const username = post.ownerUsername;
        if (!resultsByUsername.has(username)) {
          resultsByUsername.set(username, []);
        }
        resultsByUsername.get(username)?.push(post);
      });
      
      // Save search history for each username
      for (const [username, posts] of resultsByUsername) {
        if (posts.length > 0) {
          console.log(`Saving search history for ${username} with ${posts.length} posts`);
          await saveSearchHistory(username, posts);
        }
      }
      
      setBulkSearchResults(results);
      return results;
    } catch (error) {
      console.error('Bulk search error:', error);
      throw error;
    } finally {
      setIsBulkSearching(false);
    }
  };

  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : posts;

  return {
    username,
    isLoading,
    isBulkSearching,
    hasReachedLimit: requestCount >= maxRequests,
    requestCount,
    maxRequests,
    handleSearch,
    handleBulkSearch,
    displayPosts,
    subscriptionStatus,
  };
};