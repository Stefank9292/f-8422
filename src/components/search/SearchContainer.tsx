import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="responsive-container flex flex-col items-center justify-start min-h-screen py-8 md:py-12 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-6 w-full max-w-2xl">
        <SearchHeader />
        <p className="text-[13px] text-muted-foreground text-center max-w-2xl mx-auto">
          Save time finding viral content for social media
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <SearchBar
          username={username}
          onSearch={handleSearch}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading || isBulkSearching}
        />

        <Button 
          onClick={handleSearch} 
          disabled={isLoading || isBulkSearching || !username || hasReachedLimit}
          className={cn(
            "w-full h-12 text-[13px] font-medium transition-all duration-300",
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
      </div>

      {displayPosts.length > 0 && (
        <div className="w-full max-w-[90rem] space-y-6">
          <SearchFilters />
          <div className="material-card overflow-hidden animate-in fade-in duration-300">
            <SearchResults />
          </div>
        </div>
      )}
    </div>
  );
};