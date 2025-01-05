import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/apifyClient";
import { supabase } from "@/integrations/supabase/client";
import { useSearchStore } from "../../store/searchStore";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/types/instagram";
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
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { maxRequests, subscriptionStatus } = useSubscriptionLimits(session);
  const requestCount = useRequestCount(session);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: async () => {
      const results = await fetchInstagramPosts(username, numberOfVideos, selectedDate);
      
      if (results.length > 0) {
        await saveSearchHistory(username, results);
      }
      
      return results;
    },
    enabled: false,
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

    setBulkSearchResults([]);
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    setIsBulkSearching(true);
    try {
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      
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