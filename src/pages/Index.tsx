import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchBulkInstagramPosts } from "@/utils/instagram/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchSection } from "@/components/search/SearchSection";
import { SearchResultsSection } from "@/components/search/SearchResultsSection";
import { useSearchStore } from "../store/searchStore";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const {
    username,
    numberOfVideos,
    selectedDate,
    filters,
    setUsername,
    setNumberOfVideos,
    setSelectedDate,
    setFilters,
    resetFilters
  } = useSearchStore();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<any[]>([]);
  const [shouldSearch, setShouldSearch] = useState(false);
  const { toast } = useToast();

  // Query for checking usage limits
  const { data: usageData } = useQuery({
    queryKey: ['request-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return null;
      
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
  });

  // Query for subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
  });

  // Query for Instagram posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate, shouldSearch],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) throw new Error('No authenticated user found');

      // Track the request before making it
      await supabase.from('user_requests').insert({
        user_id: session.user.id,
        request_type: 'instagram_search',
        period_start: new Date(),
        period_end: new Date(new Date().setDate(new Date().getDate() + 1))
      });

      return await fetchBulkInstagramPosts([username], numberOfVideos, selectedDate);
    },
    enabled: shouldSearch && Boolean(username),
    retry: 1,
  });

  const maxRequests = subscriptionStatus?.maxClicks || 25;
  const hasReachedLimit = usageData !== undefined && usageData >= maxRequests;

  const handleSearch = () => {
    if (isLoading || isBulkSearching || hasReachedLimit) {
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

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching || hasReachedLimit) {
      return;
    }

    try {
      setIsBulkSearching(true);
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      setBulkSearchResults(results);
      return results;
    } finally {
      setIsBulkSearching(false);
    }
  };

  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : (posts || []);

  return (
    <div className="responsive-container flex flex-col items-center justify-start min-h-screen py-16 md:py-24 space-y-16 animate-in fade-in duration-300">
      <div className="space-y-8">
        <SearchHeader />
        <p className="text-muted-foreground text-lg md:text-xl text-center max-w-2xl mx-auto">
          Save time finding viral content for social media
        </p>
      </div>

      <SearchSection
        username={username}
        setUsername={setUsername}
        handleSearch={handleSearch}
        handleBulkSearch={handleBulkSearch}
        isLoading={isLoading || isBulkSearching}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        numberOfVideos={numberOfVideos}
        setNumberOfVideos={setNumberOfVideos}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        hasReachedLimit={hasReachedLimit}
      />

      {displayPosts.length > 0 && (
        <SearchResultsSection
          posts={displayPosts}
          filters={filters}
          onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
          onReset={resetFilters}
        />
      )}
    </div>
  );
};

export default Index;