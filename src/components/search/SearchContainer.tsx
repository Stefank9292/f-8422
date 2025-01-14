import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchResults } from "./SearchResults";
import { RecentSearches } from "./RecentSearches";
import { AnnouncementBar } from "./AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { 
    setUsername,
    numberOfVideos,
    setNumberOfVideos,
    selectedDate,
    setSelectedDate,
  } = useSearchStore();

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
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
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
  const isSearchDisabled = isLoading || isBulkSearching || !username.trim() || hasReachedLimit || hasNoSearchesLeft;

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-theme(spacing.20))] md:min-h-[calc(100vh-theme(spacing.32))] 
                    px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-in fade-in duration-500 w-full">
      <AnnouncementBar />
      <div className="space-y-6 sm:space-y-8 w-full max-w-lg">
        <SearchHeader />
      </div>

      <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-500 delay-150">
        <SearchBar
          username={username}
          onSearch={onSearchClick}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading || isBulkSearching}
          onUsernameChange={setUsername}
          hasReachedLimit={hasReachedLimit}
        />

        <Button 
          onClick={onSearchClick}
          disabled={isSearchDisabled}
          className={cn(
            "w-full h-11 text-[13px] font-medium transition-all duration-300 ease-spring",
            username && !hasReachedLimit && !hasNoSearchesLeft 
              ? "instagram-gradient" 
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
        <div ref={resultsRef} className="w-full animate-in fade-in duration-500 delay-300">
          <SearchResults searchResults={displayPosts} />
        </div>
      )}
    </div>
  );
};