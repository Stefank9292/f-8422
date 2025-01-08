import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchResults } from "./SearchResults";
import { SearchFilters } from "./SearchFilters";
import { RecentSearches } from "./RecentSearches";
import { AnnouncementBar } from "./AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronDown } from "lucide-react";
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
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(() => {
    const saved = localStorage.getItem("filtersCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    localStorage.setItem("filtersCollapsed", JSON.stringify(isFiltersCollapsed));
  }, [isFiltersCollapsed]);

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
        <div ref={resultsRef} className="space-y-4">
          <div className="w-full max-w-[90rem]">
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-card/50 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                    className="h-6 w-6 p-0 hover:bg-transparent"
                  >
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isFiltersCollapsed ? "" : "transform rotate-180"
                    )} />
                  </Button>
                  <span className="text-xs font-medium text-muted-foreground">
                    Filter Results
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/70">
                  Showing {displayPosts.length} results
                </span>
              </div>
              <div className={cn(
                "transition-all duration-300 ease-in-out",
                isFiltersCollapsed ? "max-h-0" : "max-h-[500px]"
              )}>
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
          </div>
          <div className="w-full max-w-[90rem]">
            <div className="material-card overflow-hidden">
              <SearchResults searchResults={displayPosts} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};