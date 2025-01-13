import { useState } from "react";
import { fetchBulkInstagramPosts } from "@/utils/instagram/services/apifyService";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/types/instagram";
import { useToast } from "@/hooks/use-toast";

interface BulkSearchProps {
  maxVideosPerSearch: number;
  isProUser: boolean;
  isSteroidsUser: boolean;
  requestCount: number;
  maxRequests: number;
}

export const useBulkSearch = ({
  maxVideosPerSearch,
  isProUser,
  isSteroidsUser,
  requestCount,
  maxRequests
}: BulkSearchProps) => {
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<InstagramPost[]>([]);
  const { toast } = useToast();

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (requestCount + urls.length > maxRequests) {
      toast({
        title: "Monthly Limit",
        description: `This bulk search would exceed your monthly limit of ${maxRequests} searches.`,
        variant: "destructive",
      });
      throw new Error(`This bulk search would exceed your monthly limit of ${maxRequests} searches.`);
    }

    const adjustedNumVideos = Math.min(numVideos, maxVideosPerSearch);
    if (numVideos > maxVideosPerSearch) {
      toast({
        title: "Video Limit Applied",
        description: `Your plan allows up to ${maxVideosPerSearch} videos per search.`,
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
    } finally {
      setIsBulkSearching(false);
    }
  };

  return {
    isBulkSearching,
    bulkSearchResults,
    handleBulkSearch,
  };
};