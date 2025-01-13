import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TikTokSearchSettings } from "./TikTokSearchSettings";
import { TikTokRecentSearches } from "./TikTokRecentSearches";

export const TikTokSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TikTok search query:", searchQuery);
    console.log("Number of videos to fetch:", numberOfVideos);
    // Future implementation will go here
  };

  const handleSelectRecentSearch = (username: string) => {
    setSearchQuery(username);
  };

  return (
    <div className="space-y-4">
      <TikTokSearchSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        numberOfVideos={numberOfVideos}
        setNumberOfVideos={setNumberOfVideos}
      />
      
      <form onSubmit={handleSearch} className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter TikTok username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="material-input"
            />
          </div>
          <Button 
            type="submit"
            className="material-button-primary w-full sm:w-auto"
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </form>

      <TikTokRecentSearches onSelect={handleSelectRecentSearch} />
    </div>
  );
};