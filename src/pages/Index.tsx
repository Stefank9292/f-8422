import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchSettings } from "@/components/search/SearchSettings";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { RecentSearches } from "@/components/search/RecentSearches";
import { Loader2, Search } from "lucide-react";
import confetti from 'canvas-confetti';
import { useSearchStore } from "../store/searchStore";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const queryClient = useQueryClient();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1DA1F2', '#14171A', '#657786', '#AAB8C2'],
      angle: 90,
      startVelocity: 30,
      gravity: 0.5,
      drift: 0,
      ticks: 200,
      decay: 0.9,
      scalar: 0.8,
      zIndex: 100,
    });
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username) && shouldSearch,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      onSuccess: (data: any[]) => {
        if (data && data.length > 0) {
          triggerConfetti();
        }
        setShouldSearch(false); // Reset the search trigger after successful search
      }
    }
  });

  const handleSearch = async () => {
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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.error('No authenticated user found');
        return;
      }

      const { error: searchHistoryError } = await supabase
        .from('search_history')
        .insert({
          search_query: username,
          search_type: 'single',
          user_id: session.user.id
        });

      if (searchHistoryError) {
        console.error('Error saving search history:', searchHistoryError);
      }

      setBulkSearchResults([]);
      setShouldSearch(true); // Trigger the search
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts', 'recent-searches'] });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to perform search",
        variant: "destructive",
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
      setBulkSearchResults(results);
      if (results && results.length > 0) {
        triggerConfetti();
      }
      return results;
    } catch (error) {
      console.error('Bulk search error:', error);
      throw error;
    } finally {
      setIsBulkSearching(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : posts;

  return (
    <div className="responsive-container flex flex-col items-center justify-start min-h-screen py-12 md:py-16 space-y-12 animate-in fade-in duration-300">
      <div className="space-y-6">
        <SearchHeader />
        <p className="text-muted-foreground text-base md:text-lg text-center max-w-xl">
          Save time finding viral content for social media
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <SearchBar
            username={username}
            onUsernameChange={setUsername}
            onSearch={handleSearch}
            onBulkSearch={handleBulkSearch}
            isLoading={isLoading || isBulkSearching}
          />

          <Button 
            onClick={handleSearch} 
            disabled={isLoading || isBulkSearching || !username}
            className={cn(
              "w-full material-button py-6 text-base md:text-lg transition-all duration-300",
              username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
              "text-white dark:text-gray-100"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span className="text-sm md:text-base">This can take up to a minute...</span>
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search Viral Videos
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <SearchSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            numberOfVideos={numberOfVideos}
            setNumberOfVideos={setNumberOfVideos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            disabled={isLoading || isBulkSearching}
          />

          <div className="flex justify-center w-full">
            <RecentSearches onSearchSelect={setUsername} />
          </div>
        </div>
      </div>

      {displayPosts.length > 0 && (
        <div className="w-full max-w-[90rem] space-y-8">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            totalResults={displayPosts.length}
            filteredResults={displayPosts.filter(post => {
              if (filters.postsNewerThan) {
                const filterDate = new Date(filters.postsNewerThan.split('.').reverse().join('-'));
                const postDate = new Date(post.timestamp);
                if (postDate < filterDate) return false;
              }
              if (filters.minViews && post.playsCount < parseInt(filters.minViews)) return false;
              if (filters.minPlays && post.viewsCount < parseInt(filters.minPlays)) return false;
              if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
              if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
              if (filters.minDuration && post.duration < filters.minDuration) return false;
              if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;
              return true;
            }).length}
            currentPosts={displayPosts}
          />
          <div className="material-card overflow-hidden animate-in fade-in duration-300">
            <SearchResults posts={displayPosts} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;