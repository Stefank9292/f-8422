import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchInstagramPosts } from "@/utils/instagram/services/apifyService";
import { saveSearchHistory } from "@/utils/searchHistory";
import { useToast } from "@/hooks/use-toast";
import { InstagramPost } from "@/utils/instagram/types/InstagramTypes";

export const useBasicSearch = (
  username: string,
  numberOfVideos: number,
  selectedDate: Date | undefined,
  shouldFetch: boolean,
  isBulkSearching: boolean,
  requestCount: number,
  maxRequests: number,
  subscriptionStatus: any,
  setShouldFetch: (value: boolean) => void
) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: async () => {
      console.log('Starting Instagram search with params:', {
        username,
        numberOfVideos,
        selectedDate,
        requestCount,
        maxRequests
      });
      
      if (requestCount >= maxRequests) {
        const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
        throw new Error(`You've reached your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`);
      }

      if (!username.trim()) {
        throw new Error('Please enter a valid Instagram username');
      }

      try {
        console.log('Fetching Instagram posts...');
        const results = await fetchInstagramPosts(username, numberOfVideos, selectedDate);
        console.log('Received results:', results);
        
        if (results.length > 0) {
          await saveSearchHistory(username, results);
        }
        
        setShouldFetch(false);
        return results;
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
      }
    },
    enabled: shouldFetch && !!username && !isBulkSearching && requestCount < maxRequests,
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      onError: (error: Error) => {
        console.error('Search error details:', {
          error: error.message,
          stack: error.stack,
          username,
          numberOfVideos,
          selectedDate
        });
        toast({
          title: "Search Failed",
          description: error.message || "Failed to fetch Instagram posts",
          variant: "destructive",
        });
        setShouldFetch(false);
      }
    },
  });
};