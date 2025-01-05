import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/apifyClient";
import { supabase } from "@/integrations/supabase/client";
import { useSearchStore } from "../../store/searchStore";
import { saveSearchHistory } from "@/utils/searchHistory";
import { InstagramPost } from "@/types/instagram";

export const useSearchState = () => {
  const {
    username,
    numberOfVideos,
    selectedDate,
    setUsername,
  } = useSearchStore();
  
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<InstagramPost[]>([]);
  const [shouldSearch, setShouldSearch] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  // Listen for real-time subscription changes
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('subscription-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
          toast({
            title: "Subscription Updated",
            description: "Your plan limitations have been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast]);

  const { data: requestCount = 0 } = useQuery({
    queryKey: ['request-count'],
    queryFn: async () => {
      if (!session?.user.id) return 0;
      
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { count } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('request_type', 'instagram_search')
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      return count || 0;
    },
    enabled: !!session?.user.id,
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: async ({ signal }) => {
      // Store the abort controller for potential cancellation
      abortControllerRef.current = new AbortController();
      
      const results = await fetchInstagramPosts(
        username, 
        numberOfVideos, 
        selectedDate,
        signal || abortControllerRef.current.signal
      );
      
      // Save search results to history and invalidate queries
      if (results.length > 0) {
        await saveSearchHistory(username, results);
        queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
        queryClient.invalidateQueries({ queryKey: ['search-history'] });
      }
      
      return results;
    },
    enabled: shouldSearch,
    meta: {
      onSettled: () => {
        setShouldSearch(false);
        abortControllerRef.current = null;
      }
    }
  });

  const getMaxRequests = () => {
    if (!subscriptionStatus?.priceId) return 3;
    if (subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
        subscriptionStatus.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") return 25;
    if (subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
        subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0") return Infinity;
    return 3;
  };

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

    setBulkSearchResults([]);
    setShouldSearch(true);
  };

  const cancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setShouldSearch(false);
      toast({
        description: "Search cancelled",
      });
    }
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    setIsBulkSearching(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] });
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      
      // Save each bulk search result to history and invalidate queries
      for (const url of urls) {
        const urlResults = results.filter(post => post.ownerUsername === url.replace('@', ''));
        if (urlResults.length > 0) {
          await saveSearchHistory(url, urlResults);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      
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
    hasReachedLimit: requestCount >= getMaxRequests(),
    requestCount,
    maxRequests: getMaxRequests(),
    handleSearch,
    handleBulkSearch,
    cancelSearch,
    displayPosts,
    subscriptionStatus,
  };
};