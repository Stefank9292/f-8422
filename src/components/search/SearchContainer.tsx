import { SearchHeader } from "./SearchHeader";
import { SearchSettings } from "./SearchSettings";
import { SearchResults } from "./SearchResults";
import { SearchFilters } from "./SearchFilters";
import { RecentSearches } from "./RecentSearches";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchInput } from "./SearchInput";
import { SearchButton } from "./SearchButton";
import { useRef, useEffect, useState } from "react";
import { useSearchStore } from "@/store/searchStore";
import { useToast } from "@/hooks/use-toast";
import { usePlatformStore } from "@/store/platformStore";
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
  const [hasScrolled, setHasScrolled] = useState(false);
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

  useEffect(() => {
    // Only scroll if we have results, aren't loading, and haven't scrolled yet
    if (displayPosts.length > 0 && !isLoading && !isBulkSearching && resultsRef.current && !hasScrolled) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        setHasScrolled(true); // Mark that we've scrolled
      }, 100);
    }
    
    // Reset the scroll flag when there are no results
    if (displayPosts.length === 0) {
      setHasScrolled(false);
    }
  }, [displayPosts, isLoading, isBulkSearching, hasScrolled]);

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
        <SearchInput
          instagramUsername={instagramUsername}
          tiktokUsername={tiktokUsername}
          onSearch={onSearchClick}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading}
          isBulkSearching={isBulkSearching}
          setInstagramUsername={setInstagramUsername}
          setTiktokUsername={setTiktokUsername}
          hasReachedLimit={hasReachedLimit}
        />

        <SearchButton
          isLoading={isLoading}
          isBulkSearching={isBulkSearching}
          hasReachedLimit={hasReachedLimit}
          requestCount={requestCount}
          maxRequests={maxRequests}
          currentUsername={currentUsername}
          onClick={onSearchClick}
        />

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

        <RecentSearches 
          onSelect={platform === 'instagram' ? setInstagramUsername : setTiktokUsername} 
          onSearch={onSearchClick}
        />
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
