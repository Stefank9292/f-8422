import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchResults } from "./SearchResults";
import { SearchFilters } from "./SearchFilters";
import { RecentSearches } from "./RecentSearches";
import { AnnouncementBar } from "./AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { useToast } from "@/hooks/use-toast";

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
  username,
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
  const [showVideoImage, setShowVideoImage] = useState(true);
  const { toast } = useToast();
  const videoImageRef = useRef<HTMLDivElement>(null);
  const resultsAnchorRef = useRef<HTMLDivElement>(null);
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

  // Effect to handle video image animation when results are loaded
  useEffect(() => {
    if (displayPosts.length > 0 && videoImageRef.current && resultsAnchorRef.current && showVideoImage) {
      const videoRect = videoImageRef.current.getBoundingClientRect();
      const resultsRect = resultsAnchorRef.current.getBoundingClientRect();
      
      const translateX = resultsRect.left - videoRect.left;
      const translateY = resultsRect.top - videoRect.top;
      
      videoImageRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
      videoImageRef.current.style.opacity = '0';
      
      // Hide the video image after animation
      setTimeout(() => {
        setShowVideoImage(false);
      }, 500); // Match this with the CSS transition duration
    }
  }, [displayPosts.length, showVideoImage]);

  const onSearchClick = () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    if (!isLoading && !isBulkSearching) {
      if (hasReachedLimit) {
        toast({
          title: "Monthly Limit Reached",
          description: `You've used ${requestCount} out of ${maxRequests} monthly searches. Please upgrade your plan for more searches.`,
          variant: "destructive",
        });
        return;
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

      {showVideoImage && (
        <div 
          ref={videoImageRef}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
          style={{ zIndex: 50 }}
        >
          <img 
            src="/lovable-uploads/9fcce97c-63d7-4cfe-ada4-5e5d7ee749c2.png" 
            alt="Video Search"
            className="w-32 h-32 object-contain"
          />
        </div>
      )}

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <SearchBar
          username={username}
          onSearch={onSearchClick}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading || isBulkSearching}
          onUsernameChange={setUsername}
        />

        <Button 
          onClick={onSearchClick}
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

      {displayPosts.length > 0 && (
        <>
          <div ref={resultsAnchorRef} className="w-full max-w-[90rem]">
            <SearchFilters
              filters={filters}
              onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
              onReset={resetFilters}
              totalResults={displayPosts.length}
              filteredResults={displayPosts.length}
              currentPosts={displayPosts}
            />
          </div>
          <div className="w-full max-w-[90rem] space-y-6 sm:space-y-8">
            <div className="material-card overflow-hidden animate-in fade-in duration-300">
              <SearchResults searchResults={displayPosts} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};