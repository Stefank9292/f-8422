import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Lock } from "lucide-react";
import { TikTokSearchHeader } from "@/components/tiktok/TikTokSearchHeader";
import { TikTokSearchBar } from "@/components/tiktok/TikTokSearchBar";
import { TikTokSearchSettings } from "@/components/tiktok/TikTokSearchSettings";
import { TikTokSearchResults } from "@/components/tiktok/TikTokSearchResults";
import { TikTokSearchFilters } from "@/components/tiktok/TikTokSearchFilters";
import { TikTokRecentSearches } from "@/components/tiktok/TikTokRecentSearches";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTikTokSearchStore } from "@/store/tiktokSearchStore";
import { useToast } from "@/hooks/use-toast";
import { TikTokPost } from "@/types/tiktok";
import { Link } from "react-router-dom";

const TikTokSearch = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { 
    username,
    setUsername,
    numberOfVideos,
    setNumberOfVideos,
    selectedDate,
    setSelectedDate,
    selectedLocation,
    setSelectedLocation,
    filters,
    setFilters,
    resetFilters
  } = useTikTokSearchStore();

  // Get session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Get subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
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

  const [isLoading, setIsLoading] = useState(false);
  const [displayPosts, setDisplayPosts] = useState<TikTokPost[]>([]);

  const handleSearch = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a TikTok username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-scraper', {
        body: {
          username,
          numberOfVideos,
          selectedDate: selectedDate?.toISOString(),
          location: selectedLocation
        }
      });

      if (error) throw error;

      setDisplayPosts(data.results);

      // Save search history
      await supabase.from('tiktok_search_history').insert({
        search_query: username,
        search_type: 'user_search',
        location: selectedLocation,
        user_id: session?.user?.id
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch TikTok data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (displayPosts.length > 0 && !isLoading && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [displayPosts, isLoading]);

  const isSearchDisabled = isLoading || !username.trim();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4 sm:space-y-6 w-full max-w-md">
        <TikTokSearchHeader />
        <p className="text-[11px] text-muted-foreground text-center max-w-xl mx-auto">
          Save time finding viral TikTok content
        </p>
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <TikTokSearchBar
          username={username}
          onSearch={handleSearch}
          isLoading={isLoading}
          onUsernameChange={setUsername}
        />

        <Button 
          onClick={handleSearch}
          disabled={isSearchDisabled}
          className={cn(
            "w-full h-10 text-[11px] font-medium transition-all duration-300",
            username ? "bg-[#FF0050] hover:bg-[#D6004B]" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
            "text-white dark:text-gray-100 shadow-sm hover:shadow-md"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              <span>Searching TikTok videos...</span>
            </>
          ) : (
            <>
              <Search className="mr-2 h-3.5 w-3.5" />
              Search TikTok Videos
            </>
          )}
        </Button>

        <TikTokSearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          disabled={isLoading}
        />

        <TikTokRecentSearches onSelect={setUsername} />
      </div>

      {displayPosts.length > 0 && (
        <div ref={resultsRef} className="space-y-4">
          <div className="w-full max-w-[90rem]">
            <div className="rounded-xl sm:border sm:border-border/50 overflow-hidden">
              <TikTokSearchFilters
                filters={filters}
                onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
                onReset={resetFilters}
                totalResults={displayPosts.length}
                filteredResults={displayPosts.length}
                currentPosts={displayPosts}
              />
            </div>
          </div>
          <div className="w-full max-w-[90rem]">
            <div className="sm:material-card overflow-hidden">
              <TikTokSearchResults searchResults={displayPosts} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokSearch;