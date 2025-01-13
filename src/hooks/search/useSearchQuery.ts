import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts } from "@/utils/instagram/services/apifyService";
import { fetchTikTokPosts } from "@/utils/tiktok/services/apifyService";
import { saveSearchHistory } from "@/utils/searchHistory";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { transformTikTokPosts } from "@/utils/tiktok/transformers/postTransformer";

interface SearchQueryProps {
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

export const useSearchQuery = ({
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
}: SearchQueryProps) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { toast } = useToast();

  const maxVideosPerSearch = isSteroidsUser ? Infinity : isProUser ? 25 : 3;

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: [
      'social-posts', 
      currentUsername, 
      platform,
      numberOfVideos,
      selectedDate?.toISOString(),
      dateRange,
      location
    ],
    queryFn: async () => {
      if (requestCount >= maxRequests) {
        const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
        throw new Error(`You've reached your monthly limit of ${maxRequests} searches on the ${planName} plan.`);
      }

      try {
        if (platform === 'instagram') {
          const adjustedNumberOfVideos = Math.min(numberOfVideos, maxVideosPerSearch);
          
          if (numberOfVideos > maxVideosPerSearch) {
            toast({
              title: "Video Limit Applied",
              description: `Your plan allows up to ${maxVideosPerSearch} videos per search.`,
            });
          }
          
          const results = await fetchInstagramPosts(currentUsername, adjustedNumberOfVideos, selectedDate);
          
          if (results.length > 0) {
            await saveSearchHistory(currentUsername, results);
          }
          
          return results;
        } else if (platform === 'tiktok') {
          const tiktokResults = await fetchTikTokPosts(currentUsername, numberOfVideos, dateRange, location);
          const transformedResults = transformTikTokPosts(tiktokResults);
          
          if (transformedResults.length > 0) {
            await saveSearchHistory(currentUsername, transformedResults);
          }
          
          return transformedResults;
        }
        return [];
      } catch (error) {
        console.error(`Error fetching ${platform} posts:`, error);
        throw error;
      }
    },
    enabled: shouldFetch && !!currentUsername && requestCount < maxRequests,
    retry: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    posts,
    isLoading,
    error,
    setShouldFetch,
    maxVideosPerSearch
  };
};