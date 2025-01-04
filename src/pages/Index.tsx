import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchSettings } from "@/components/search/SearchSettings";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [username, setUsername] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [numberOfVideos, setNumberOfVideos] = useState(3);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    minViews: "",
    minPlays: "",
    minLikes: "",
    minComments: "",
    minDuration: "",
    minEngagement: "",
    postsNewerThan: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use staleTime: Infinity to keep the data fresh indefinitely until explicitly invalidated
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate, searchTrigger],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username && searchTrigger && !isBulkSearching),
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: Infinity, // Never garbage collect the data
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const handleSearch = async () => {
    if (isSearching || isLoading || isBulkSearching) {
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

    setIsSearching(true);
    try {
      setBulkSearchResults([]); // Clear bulk search results when using normal search
      // Invalidate the previous query cache before triggering a new search
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] });
      setSearchTrigger(prev => prev + 1);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isSearching || isLoading || isBulkSearching) {
      return;
    }

    setIsBulkSearching(true);
    try {
      // Clear the regular search results cache when doing a bulk search
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] });
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      setBulkSearchResults(results);
      return results;
    } catch (error) {
      console.error('Bulk search error:', error);
      throw error;
    } finally {
      setIsBulkSearching(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      minViews: "",
      minPlays: "",
      minLikes: "",
      minComments: "",
      minDuration: "",
      minEngagement: "",
      postsNewerThan: ""
    });
  };

  // Determine which posts to display based on whether we're showing bulk search results or normal search results
  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : posts;

  return (
    <div className="container mx-auto flex flex-col items-center justify-start min-h-screen p-4 space-y-8 animate-in fade-in duration-200">
      <SearchHeader />

      <p className="text-gray-600 dark:text-gray-300 text-lg text-center">
        Save time finding viral content for social media
      </p>

      <div className="w-full max-w-2xl space-y-4">
        <SearchBar
          username={username}
          onUsernameChange={setUsername}
          onSearch={handleSearch}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading || isBulkSearching || isSearching}
        />

        <Button 
          onClick={handleSearch} 
          disabled={isLoading || isBulkSearching || isSearching}
          className="w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              This can take up to a minute...
            </>
          ) : (
            "Search"
          )}
        </Button>

        <SearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disabled={isLoading || isBulkSearching || isSearching}
        />
      </div>

      {displayPosts.length > 0 && (
        <div className="w-full max-w-6xl space-y-4">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300 ease-spring">
            <SearchResults posts={displayPosts} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
