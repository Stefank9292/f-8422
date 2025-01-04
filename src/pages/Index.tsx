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
import confetti from 'canvas-confetti';

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
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate, searchTrigger],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username && searchTrigger && !isBulkSearching),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data && data.length > 0) {
        triggerConfetti();
      }
    },
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
      setBulkSearchResults([]);
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

  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : posts;

  return (
    <div className="responsive-container flex flex-col items-center justify-start min-h-screen py-8 md:py-12 space-y-8 animate-in fade-in duration-300">
      <SearchHeader />

      <p className="text-muted-foreground text-base md:text-lg text-center max-w-xl">
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
          className="w-full material-button-primary instagram-gradient py-6 text-base md:text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm md:text-base">This can take up to a minute...</span>
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
        <div className="w-full max-w-[90rem] space-y-6">
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
          <div className="material-card overflow-hidden animate-in fade-in duration-300">
            <SearchResults posts={displayPosts} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
