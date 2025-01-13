import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/services/apifyService";
import { fetchTikTokPosts } from "@/utils/tiktok/services/apifyService";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/utils/instagram/types/InstagramTypes";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<InstagramPost[]>([]);
  const { toast } = useToast();

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
      console.log('Starting search with params:', {
        platform,
        username: currentUsername,
        numberOfVideos,
        selectedDate,
        dateRange,
        location,
        requestCount,
        maxRequests
      });
      
      if (requestCount >= maxRequests) {
        const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
        throw new Error(`You've reached your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`);
      }

      if (!currentUsername.trim()) {
        throw new Error('Please enter a valid username');
      }

      try {
        if (platform === 'instagram') {
          const maxVideosPerSearch = isSteroidsUser ? Infinity : isProUser ? 25 : 3;
          const adjustedNumberOfVideos = Math.min(numberOfVideos, maxVideosPerSearch);
          
          if (numberOfVideos > maxVideosPerSearch) {
            toast({
              title: "Video Limit Applied",
              description: `Your plan allows up to ${maxVideosPerSearch} videos per search. Adjusting your request accordingly.`,
            });
          }
          
          console.log('Fetching Instagram posts...');
          const results = await fetchInstagramPosts(currentUsername, adjustedNumberOfVideos, selectedDate);
          console.log('Received Instagram results:', results);
          
          if (results.length > 0) {
            await saveSearchHistory(currentUsername, results);
          }
          
          return results;
        } else if (platform === 'tiktok') {
          console.log('Fetching TikTok posts...');
          const results = await fetchTikTokPosts(currentUsername, numberOfVideos, dateRange, location);
          console.log('Received TikTok results:', results);
          
          if (results.length > 0) {
            await saveSearchHistory(currentUsername, results as unknown as InstagramPost[]);
          }
          
          return results;
        }
        return [];
      } catch (error) {
        console.error(`Error fetching ${platform} posts:`, error);
        throw error;
      }
    },
    enabled: shouldFetch && !!currentUsername && !isBulkSearching && requestCount < maxRequests,
    retry: false,
    staleTime: 0, // Set to 0 to ensure fresh data on each search
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      onError: (error: Error) => {
        console.error('Search error details:', {
          error: error.message,
          stack: error.stack,
          platform,
          username: currentUsername,
          numberOfVideos,
          selectedDate,
          dateRange,
          location
        });
        toast({
          title: "Search Failed",
          description: error.message || "Failed to fetch posts",
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

    if (!currentUsername) {
      toast({
        title: "Error",
        description: "Please enter a username",
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

    setBulkSearchResults([]);
    setShouldFetch(true);
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    if (requestCount + urls.length > maxRequests) {
      const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
      toast({
        title: "Monthly Limit Reached",
        description: `This bulk search would exceed your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`,
        variant: "destructive",
      });
      return;
    }

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
          await saveSearchHistory(url, urlResults, [url]);
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

  return {
    posts: bulkSearchResults.length > 0 ? bulkSearchResults : posts,
    isLoading,
    isBulkSearching,
    handleSearch,
    handleBulkSearch,
  };
};