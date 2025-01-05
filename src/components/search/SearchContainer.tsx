import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";
import { RecentSearches } from "./RecentSearches";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSearchStore } from "@/store/searchStore";

interface SearchContainerProps {
  username: string;
  isLoading: boolean;
  isBulkSearching: boolean;
  hasReachedLimit: boolean;
  requestCount: number;
  maxRequests: number;
  handleSearch: () => void;
  handleBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<any>;
  cancelSearch: () => void;
  displayPosts: any[];
}

export const SearchContainer = ({
  username,
  isLoading,
  isBulkSearching,
  hasReachedLimit,
  requestCount,
  maxRequests,
  handleSearch,
  handleBulkSearch,
  cancelSearch,
  displayPosts
}: SearchContainerProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { 
    setUsername,
    numberOfVideos,
    setNumberOfVideos,
    selectedDate,
    setSelectedDate,
    filters,
    setFilters,
    resetFilters
  } = useSearchStore();

  const onSearchClick = () => {
    if (!isLoading && !isBulkSearching && username && !hasReachedLimit) {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4 sm:space-y-6 w-full max-w-md">
        <SearchHeader />
        <p className="text-[11px] text-muted-foreground text-center max-w-xl mx-auto">
          Save time finding viral content for social media
        </p>
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <SearchBar
          username={username}
          onSearch={onSearchClick}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading || isBulkSearching}
          onUsernameChange={setUsername}
        />

        <div className="flex gap-2">
          <Button 
            onClick={onSearchClick}
            disabled={isLoading || isBulkSearching || !username || hasReachedLimit}
            className={cn(
              "flex-1 h-10 text-[11px] font-medium transition-all duration-300",
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
                Daily Limit Reached ({requestCount}/{maxRequests})
              </>
            ) : (
              <>
                <Search className="mr-2 h-3.5 w-3.5" />
                Search Viral Videos
              </>
            )}
          </Button>

          {isLoading && (
            <Button
              onClick={cancelSearch}
              variant="destructive"
              size="icon"
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

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

      {displayPosts.length > 0 && (
        <div className="w-full max-w-[90rem] space-y-6 sm:space-y-8">
          <SearchFilters
            filters={filters}
            onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
            onReset={resetFilters}
            totalResults={displayPosts.length}
            filteredResults={displayPosts.length}
            currentPosts={displayPosts}
          />
          <div className="material-card overflow-hidden animate-in fade-in duration-300">
            <SearchResults searchResults={displayPosts} />
          </div>
        </div>
      )}
    </div>
  );
};