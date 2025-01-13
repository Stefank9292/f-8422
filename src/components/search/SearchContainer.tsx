import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchResults } from "./SearchResults";
import { SearchFilters } from "./SearchFilters";
import { RecentSearches } from "./RecentSearches";
import { AnnouncementBar } from "./AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { usePlatformStore } from "@/store/platformStore";
import { TikTokSearchBar } from "./tiktok/TikTokSearchBar";
import { TikTokSearchSettings } from "./tiktok/TikTokSearchSettings";

interface SearchContainerProps {
  username: string;
  isLoading: boolean;
  isBulkSearching: boolean;
  hasReachedLimit: boolean;
  requestCount: number;
  maxRequests: number;
  handleSearch: () => void;
  handleBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<any>;
  displayPosts: any[];
}

export const SearchContainer = ({
  isLoading,
  isBulkSearching,
  hasReachedLimit,
  requestCount,
  maxRequests,
  handleSearch,
  handleBulkSearch,
  displayPosts
}: SearchContainerProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { platform } = usePlatformStore();
  const { 
    instagramUsername,
    tiktokUsername,
    setInstagramUsername,
    setTiktokUsername,
    numberOfVideos,
    setNumberOfVideos,
    selectedDate,
    setSelectedDate,
    filters,
    setFilters,
    resetFilters,
    dateRange,
    setDateRange,
    location,
    setLocation,
  } = useSearchStore();

  const currentUsername = platform === 'instagram' ? instagramUsername : tiktokUsername;
  const setUsername = platform === 'instagram' ? setInstagramUsername : setTiktokUsername;

  useEffect(() => {
    if (displayPosts.length > 0 && !isLoading && !isBulkSearching && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [displayPosts, isLoading, isBulkSearching]);

  const onSearchClick = () => {
    if (!currentUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    if (hasReachedLimit) {
      toast({
        title: "Monthly Limit Reached",
        description: `You've used ${requestCount} out of ${maxRequests} monthly searches. Please upgrade your plan for more searches.`,
        variant: "destructive",
      });
      return;
    }

    if (!isLoading && !isBulkSearching) {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      }
      handleSearch();
    }
  };

  const hasNoSearchesLeft = requestCount >= maxRequests;
  const isSearchDisabled = isLoading || isBulkSearching || !currentUsername.trim() || hasReachedLimit || hasNoSearchesLeft;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <AnnouncementBar />
      <div className="space-y-4 sm:space-y-6 w-full max-w-md">
        <SearchHeader />
        <p className="text-[11px] text-muted-foreground text-center max-w-xl mx-auto">
          Save time finding viral content for social media
        </p>
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {platform === 'instagram' ? (
          <SearchBar
            username={instagramUsername}
            onSearch={onSearchClick}
            onBulkSearch={handleBulkSearch}
            isLoading={isLoading || isBulkSearching}
            onUsernameChange={setInstagramUsername}
            hasReachedLimit={hasReachedLimit}
          />
        ) : (
          <TikTokSearchBar
            username={tiktokUsername}
            onSearch={onSearchClick}
            isLoading={isLoading}
            onUsernameChange={setTiktokUsername}
            hasReachedLimit={hasReachedLimit}
          />
        )}

        <Button 
          onClick={onSearchClick}
          disabled={isSearchDisabled}
          className={cn(
            "w-full h-10 text-[11px] font-medium transition-all duration-300",
            currentUsername && !hasReachedLimit && !hasNoSearchesLeft 
              ? platform === 'instagram' 
                ? "instagram-gradient"
                : "tiktok-gradient"
              : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
            "text-white dark:text-gray-100 shadow-sm hover:shadow-md",
            (hasReachedLimit || hasNoSearchesLeft) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              <span>This can take up to a minute...</span>
            </>
          ) : hasReachedLimit || hasNoSearchesLeft ? (
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" />
              <span>Monthly Limit Reached ({requestCount}/{maxRequests})</span>
              <Link 
                to="/subscribe" 
                className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded hover:bg-white/30 transition-colors"
              >
                Upgrade
              </Link>
            </div>
          ) : (
            <>
              <Search className="mr-2 h-3.5 w-3.5" />
              Search Viral Videos
            </>
          )}
        </Button>

        {platform === 'instagram' ? (
          <SearchSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            numberOfVideos={numberOfVideos}
            setNumberOfVideos={setNumberOfVideos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            disabled={isLoading || isBulkSearching}
          />
        ) : (
          <TikTokSearchSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            dateRange={dateRange}
            setDateRange={setDateRange}
            location={location}
            setLocation={setLocation}
            numberOfVideos={numberOfVideos}
            setNumberOfVideos={setNumberOfVideos}
            disabled={isLoading}
          />
        )}

        <RecentSearches onSelect={setUsername} />
      </div>

      {displayPosts.length > 0 && (
        <div ref={resultsRef} className="space-y-4">
          <div className="w-full max-w-[90rem]">
            <div className="rounded-xl sm:border sm:border-border/50 overflow-hidden">
              <SearchFilters
                filters={filters}
                onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
                onReset={resetFilters}
                totalResults={displayPosts.length}
                filteredResults={displayPosts.length}
                currentPosts={displayPosts}
              />
            </div>
          </div>
          <div className="w-full max-w-[90rem]">
            <div className="sm:material-card overflow-hidden">
              <SearchResults searchResults={displayPosts} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
