import { SearchBar } from "../SearchBar";
import { Button } from "@/components/ui/button";
import { SearchSettings } from "../SearchSettings";
import { RecentSearches } from "../RecentSearches";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputSectionProps {
  username: string;
  isLoading: boolean;
  isBulkSearching: boolean;
  hasReachedLimit: boolean;
  requestCount: number;
  maxRequests: number;
  onSearch: () => void;
  onBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<any>;
  setUsername: (username: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const SearchInputSection = ({
  username,
  isLoading,
  isBulkSearching,
  hasReachedLimit,
  requestCount,
  maxRequests,
  onSearch,
  onBulkSearch,
  setUsername,
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
}: SearchInputSectionProps) => {
  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6">
      <SearchBar
        username={username}
        onSearch={onSearch}
        onBulkSearch={onBulkSearch}
        isLoading={isLoading || isBulkSearching}
        onUsernameChange={setUsername}
      />

      <Button 
        onClick={onSearch}
        disabled={isLoading || isBulkSearching || !username.trim() || hasReachedLimit}
        className={cn(
          "w-full h-10 text-[11px] font-medium transition-all duration-300",
          username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
          "text-white dark:text-gray-100 shadow-sm hover:shadow-md",
          hasReachedLimit && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            <span>This can take up to a minute...</span>
          </>
        ) : hasReachedLimit ? (
          <>
            <Search className="mr-2 h-3.5 w-3.5" />
            Monthly Limit Reached ({requestCount}/{maxRequests})
          </>
        ) : (
          <>
            <Search className="mr-2 h-3.5 w-3.5" />
            Search Viral Videos
          </>
        )}
      </Button>

      <SearchSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        numberOfVideos={numberOfVideos}
        setNumberOfVideos={setNumberOfVideos}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        disabled={isLoading || isBulkSearching}
      />

      <RecentSearches onSelect={setUsername} />
    </div>
  );
};