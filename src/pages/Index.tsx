import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts } from "@/utils/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchSettings } from "@/components/search/SearchSettings";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";

const Index = () => {
  const [username, setUsername] = useState("");
  const [numberOfVideos, setNumberOfVideos] = useState(3);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const handleSearch = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    // This will trigger the query
    setUsername(username);
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

  const filteredPosts = posts.filter(post => {
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) return false;
    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) return false;
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    if (filters.minDuration && post.duration < filters.minDuration) return false;
    if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;
    if (filters.postsNewerThan && new Date(post.date) < new Date(filters.postsNewerThan)) return false;
    return true;
  });

  return (
    <div className="container mx-auto flex flex-col items-center justify-start min-h-screen p-4 space-y-8">
      <SearchHeader />

      <p className="text-gray-600 text-lg text-center">
        Save time finding viral content for social media
      </p>

      <div className="w-full max-w-2xl space-y-4">
        <SearchBar
          username={username}
          onUsernameChange={setUsername}
          onSearch={handleSearch}
        />

        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>

        <SearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Results Section */}
      {posts.length > 0 && (
        <div className="w-full max-w-6xl space-y-4">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
            totalResults={posts.length}
            filteredResults={filteredPosts.length}
          />
          <SearchResults posts={filteredPosts} />
        </div>
      )}
    </div>
  );
};

export default Index;