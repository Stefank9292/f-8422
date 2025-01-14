import { TikTokSearchHeader } from "./TikTokSearchHeader";
import { TikTokSearchBar } from "./TikTokSearchBar";
import { TikTokSearchSettings, DateRangeOption, LocationOption } from "./TikTokSearchSettings";
import { TikTokSearchResults } from "./TikTokSearchResults";
import { useState } from "react";
import { fetchTikTokPosts } from "@/utils/tiktok/services/tiktokService";
import { useToast } from "@/hooks/use-toast";

export const TikTokSearchContainer = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState(5);
  const [dateRange, setDateRange] = useState<DateRangeOption>("DEFAULT");
  const [location, setLocation] = useState<LocationOption>("US");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a TikTok username or URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchTikTokPosts(username, numberOfVideos, dateRange, location);
      setSearchResults(results);
      toast({
        description: `Found ${results.length} videos for @${username.replace('@', '')}`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch TikTok data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4 sm:space-y-6 w-full max-w-md">
        <TikTokSearchHeader />
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
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
      </div>

      <TikTokSearchResults searchResults={searchResults} />
    </div>
  );
};