import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/services/apifyService";
import { supabase } from "@/integrations/supabase/client";
import { useSearchStore } from "../../store/searchStore";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/utils/instagram/types/InstagramTypes";
import { useUsageStats } from "@/hooks/useUsageStats";

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
    isProUser,
    isSteroidsUser,
    subscriptionStatus
  } = useUsageStats(session);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: async () => {
      console.log('Fetching Instagram posts for:', username);
      
      if (requestCount >= maxRequests) {
        const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
        throw new Error(`You've reached your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`);
      }

      if (!username.trim()) {
        throw new Error('Please enter a valid Instagram username');
      }

      // Enforce video limit based on subscription
      const maxVideosPerSearch = isSteroidsUser ? Infinity : isProUser ? 25 : 3;
      const adjustedNumberOfVideos = Math.min(numberOfVideos, maxVideosPerSearch);
      
      if (numberOfVideos > maxVideosPerSearch) {
        toast({
          title: "Video Limit Applied",
          description: `Your plan allows up to ${maxVideosPerSearch} videos per search. Adjusting your request accordingly.`,
        });
      }
      
      const results = await fetchInstagramPosts(username, adjustedNumberOfVideos, selectedDate);
      
      if (results.length > 0) {
        await saveSearchHistory(username, results);
      }
      
      setShouldFetch(false);
      
      return results;
    },
    enabled: shouldFetch && !!username && !isBulkSearching && requestCount < maxRequests,
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
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
      const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
      toast({
        title: "Monthly Limit Reached",
        description: `You've reached your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`,
        variant: "destructive",
      });
      return;
    }

    // Reset any existing results before new search
    setBulkSearchResults([]);
    setShouldFetch(true);
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    // Check if user has enough searches left for all URLs
    if (requestCount + urls.length > maxRequests) {
      const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
      toast({
        title: "Monthly Limit Reached",
        description: `This bulk search would exceed your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`,
        variant: "destructive",
      });
      return;
    }

    // Enforce video limit based on subscription
    const maxVideosPerSearch = isSteroidsUser ? Infinity : isProUser ? 25 : 3;
    const adjustedNumVideos = Math.min(numVideos, maxVideosPerSearch);

    if (numVideos > maxVideosPerSearch) {
      toast({
        title: "Video Limit Applied",
        description: `Your plan allows up to ${maxVideosPerSearch} videos per search. Adjusting your request accordingly.`,
      });
    }

    setIsBulkSearching(true);
    try {
      const results = await fetchBulkInstagramPosts(urls, adjustedNumVideos, date);
      
      for (const url of urls) {
        const urlResults = results.filter(post => post.ownerUsername === url.replace('@', ''));
        if (urlResults.length > 0) {
          await saveSearchHistory(url, urlResults);
        }
      }
      
      setBulkSearchResults(results);
      return results;
    } catch (error) {
      console.error('Bulk search error:', error);
      throw error;
    } finally {
      setIsBulkSearching(false);
      setShouldFetch(false);
    }
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