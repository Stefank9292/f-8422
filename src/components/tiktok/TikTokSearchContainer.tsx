import { TikTokSearchHeader } from "./TikTokSearchHeader";
import { TikTokSearchBar } from "./TikTokSearchBar";
import { TikTokSearchSettings, DateRangeOption, LocationOption } from "./TikTokSearchSettings";
import { TikTokSearchResults } from "./TikTokSearchResults";
import { TikTokRecentSearches } from "./TikTokRecentSearches";
import { useState, useEffect } from "react";
import { fetchTikTokPosts } from "@/utils/tiktok/services/tiktokService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const TikTokSearchContainer = () => {
  console.log('TikTokSearchContainer: Component mounting');
  
  const [username, setUsername] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState(5);
  const [dateRange, setDateRange] = useState<DateRangeOption>("DEFAULT");
  const [location, setLocation] = useState<LocationOption>("US");
  const [shouldSearch, setShouldSearch] = useState(false);
  const { toast } = useToast();

  // Get current user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      console.log('TikTokSearchContainer: Fetching session');
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Load saved search parameters and results from localStorage on mount only
  useEffect(() => {
    console.log('TikTokSearchContainer: Loading saved search parameters');
    const savedSearch = localStorage.getItem('tiktok-search');
    const savedResults = localStorage.getItem('tiktok-results');
    
    if (savedSearch) {
      const { username: savedUsername, numberOfVideos: savedNumber, dateRange: savedRange, location: savedLocation } = JSON.parse(savedSearch);
      console.log('TikTokSearchContainer: Found saved search:', { savedUsername, savedNumber, savedRange, savedLocation });
      if (!username) { // Only set if username is empty to prevent overwriting active search
        setUsername(savedUsername || "");
        setNumberOfVideos(savedNumber || 5);
        setDateRange(savedRange || "DEFAULT");
        setLocation(savedLocation || "US");
      }
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // TikTok search query with persistence
  const { 
    data: searchResults = [], 
    isLoading,
    error: searchError
  } = useQuery({
    queryKey: ['tiktok-search', username, numberOfVideos, dateRange, location, shouldSearch],
    queryFn: async () => {
      if (!username.trim()) return [];
      
      console.log('TikTokSearchContainer: Executing search with params:', { 
        username, 
        numberOfVideos, 
        dateRange, 
        location,
        shouldSearch 
      });

      const results = await fetchTikTokPosts(username, numberOfVideos, dateRange, location);

      // Save search to history if user is logged in
      if (session?.user?.id) {
        console.log('TikTokSearchContainer: Saving search to history');
        const { error } = await supabase
          .from('tiktok_search_history')
          .insert({
            user_id: session.user.id,
            search_query: username.replace('@', ''),
            search_type: 'user_search',
            location
          });

        if (error) {
          console.error('Error saving search history:', error);
        }
      }

      // Save successful search parameters and results
      localStorage.setItem('tiktok-search', JSON.stringify({
        username,
        numberOfVideos,
        dateRange,
        location
      }));
      
      localStorage.setItem('tiktok-results', JSON.stringify(results));

      return results;
    },
    enabled: shouldSearch && Boolean(username.trim()),
    staleTime: Infinity, // Keep data fresh indefinitely until explicitly invalidated
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  const handleSearch = async () => {
    console.log('TikTokSearchContainer: Search triggered by user');
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a TikTok username or URL",
        variant: "destructive",
      });
      return;
    }

    setShouldSearch(true);
  };

  // Show error state if search fails
  useEffect(() => {
    if (searchError) {
      console.error('TikTokSearchContainer: Search error:', searchError);
      toast({
        title: "Error",
        description: searchError instanceof Error ? searchError.message : "Failed to fetch TikTok data",
        variant: "destructive",
      });
      setShouldSearch(false);
    }
  }, [searchError, toast]);

  // Load saved results on mount
  const [persistedResults, setPersistedResults] = useState<any[]>([]);
  useEffect(() => {
    const savedResults = localStorage.getItem('tiktok-results');
    if (savedResults) {
      setPersistedResults(JSON.parse(savedResults));
    }
  }, []);

  // Update persisted results when new search results come in
  useEffect(() => {
    if (searchResults.length > 0) {
      setPersistedResults(searchResults);
    }
  }, [searchResults]);

  // Cleanup logging
  useEffect(() => {
    return () => {
      console.log('TikTokSearchContainer: Component unmounting');
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-theme(spacing.20))] md:min-h-[calc(100vh-theme(spacing.32))] 
                    px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-in fade-in duration-500 w-full">
      <div className="space-y-6 sm:space-y-8 w-full max-w-lg">
        <TikTokSearchHeader />
      </div>

      <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-500 delay-150">
        <TikTokSearchBar
          username={username}
          onUsernameChange={setUsername}
          isLoading={isLoading}
          onSearch={handleSearch}
        />
        
        <TikTokSearchSettings 
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          dateRange={dateRange}
          setDateRange={setDateRange}
          location={location}
          setLocation={setLocation}
          disabled={isLoading}
        />

        <TikTokRecentSearches onSelect={setUsername} />
      </div>

      <div className="w-full animate-in fade-in duration-500 delay-300">
        <TikTokSearchResults searchResults={persistedResults.length > 0 ? persistedResults : searchResults} />
      </div>
    </div>
  );
};