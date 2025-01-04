import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchSettings } from "@/components/search/SearchSettings";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { RecentSearches } from "@/components/search/RecentSearches";
import { Loader2, Search } from "lucide-react";
import { useSearchStore } from "../store/searchStore";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";

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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username) && shouldSearch,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      onSuccess: async (data: any[]) => {
        if (data && data.length > 0) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) {
              console.error('No authenticated user found');
              return;
            }

            const { data: searchHistory, error: searchError } = await supabase
              .from('search_history')
              .insert({
                search_query: username,
                search_type: 'single',
                user_id: session.user.id
              })
              .select()
              .single();

            if (searchError) {
              console.error('Error saving search history:', searchError);
              return;
            }

            const { error: resultsError } = await supabase
              .from('search_results')
              .insert({
                search_history_id: searchHistory.id,
                results: JSON.parse(JSON.stringify(data))
              });

            if (resultsError) {
              console.error('Error saving search results:', resultsError);
            }

            // Invalidate recent searches query after successful search
            queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
          } catch (error) {
            console.error('Error storing search results:', error);
          }
        }
        setShouldSearch(false);
      }
    }
  });

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

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    setIsBulkSearching(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] });
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      setBulkSearchResults(results);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id && results.length > 0) {
        for (const url of urls) {
          const { data: searchHistory } = await supabase
            .from('search_history')
            .insert({
              search_query: url,
              search_type: 'bulk',
              user_id: session.user.id
            })
            .select()
            .single();

          if (searchHistory) {
            const filteredResults = results.filter(result => 
              result.ownerUsername === url.replace('@', '').replace('https://www.instagram.com/', '').replace('/', '')
            );

            if (filteredResults.length > 0) {
              await supabase
                .from('search_results')
                .insert({
                  search_history_id: searchHistory.id,
                  results: JSON.parse(JSON.stringify(filteredResults))
                });
            }
          }
        }
        // Invalidate recent searches query after successful bulk search
        queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
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
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <SearchHeader />
          <p className="text-muted-foreground text-lg text-center">
            Save time finding viral content for social media
          </p>
        </div>

        <div className="space-y-8">
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
                "w-full material-button py-8 text-lg transition-all duration-300",
                username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
                "text-white dark:text-gray-100 shadow-lg hover:shadow-xl"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  <span>This can take up to a minute...</span>
                </>
              ) : (
                <>
                  <Search className="mr-3 h-6 w-6" />
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
      </div>

      {displayPosts.length > 0 && (
        <div className="w-full max-w-[90rem] mx-auto space-y-8">
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
          <div className="rounded-xl border border-border overflow-hidden">
            <SearchResults posts={displayPosts} filters={filters} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Index;