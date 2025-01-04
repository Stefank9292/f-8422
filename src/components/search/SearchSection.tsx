import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { RecentSearches } from "./RecentSearches";
import { cn } from "@/lib/utils";

interface SearchSectionProps {
  username: string;
  setUsername: (username: string) => void;
  handleSearch: () => void;
  handleBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<any>;
  isLoading: boolean;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  hasReachedLimit: boolean;
}

export function SearchSection({
  username,
  setUsername,
  handleSearch,
  handleBulkSearch,
  isLoading,
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
  hasReachedLimit
}: SearchSectionProps) {
  return (
    <div className="w-full max-w-2xl space-y-12">
      <div className="space-y-6">
        <SearchBar
          username={username}
          onUsernameChange={setUsername}
          onSearch={handleSearch}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading}
          disabled={hasReachedLimit}
        />

        <Button 
          onClick={handleSearch} 
          disabled={isLoading || !username || hasReachedLimit}
          className={cn(
            "w-full material-button py-8 text-lg md:text-xl transition-all duration-300",
            username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
            "text-white dark:text-gray-100 shadow-lg hover:shadow-xl",
            hasReachedLimit && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              <span>This can take up to a minute...</span>
            </>
          ) : hasReachedLimit ? (
            <>
              <Search className="mr-3 h-6 w-6" />
              Daily Limit Reached
            </>
          ) : (
            <>
              <Search className="mr-3 h-6 w-6" />
              Search Viral Videos
            </>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        <SearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disabled={isLoading}
          onSearchSelect={setUsername}
        />

        <div className="flex justify-center w-full">
          <RecentSearches onSearchSelect={setUsername} />
        </div>
      </div>
    </div>
  );
}