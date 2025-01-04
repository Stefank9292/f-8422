import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchInstagramPosts } from "@/utils/apifyClient";
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
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate, searchTrigger],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username && searchTrigger),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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

    setSearchTrigger(prev => prev + 1);
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    setIsBulkSearching(true);
    try {
      // For now, we'll just use the first URL as an example
      if (urls.length > 0) {
        setUsername(urls[0]);
        setNumberOfVideos(numVideos);
        setSelectedDate(date);
        setSearchTrigger(prev => prev + 1);
      }
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
          onBulkSearch={handleBulkSearch}
          isLoading={isBulkSearching}
        />

        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="w-full"
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
        />
      </div>

      {posts.length > 0 && (
        <div className="w-full max-w-6xl space-y-4">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
            totalResults={posts.length}
            filteredResults={posts.filter(post => {
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
            currentPosts={posts}
          />
          <SearchResults posts={posts} filters={filters} />
        </div>
      )}
    </div>
  );
};

export default Index;