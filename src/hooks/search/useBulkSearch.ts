import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchBulkInstagramPosts } from "@/utils/instagram/services/apifyService";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/utils/instagram/types/InstagramTypes";

export const useBulkSearch = (
  requestCount: number,
  maxRequests: number,
  subscriptionStatus: any,
  setShouldFetch: (value: boolean) => void
) => {
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<InstagramPost[]>([]);
  const { toast } = useToast();

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isBulkSearching) {
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
      setShouldFetch(false);
    }
  };

  return {
    isBulkSearching,
    bulkSearchResults,
    setBulkSearchResults,
    handleBulkSearch
  };
};