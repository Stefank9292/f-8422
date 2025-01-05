import { SearchHeader } from "./SearchHeader";
import { SearchBar } from "./SearchBar";
import { SearchSettings } from "./SearchSettings";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";
import { SearchButton } from "./SearchButton";
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

  return (
    <div className="responsive-container flex flex-col items-center justify-start min-h-screen py-12 md:py-16 space-y-8 md:space-y-12 animate-in fade-in duration-300">
      <div className="space-y-6 w-full max-w-md">
        <SearchHeader />
        <p className="text-[11px] text-muted-foreground text-center max-w-xl mx-auto">
          Save time finding viral content for social media
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <SearchBar
          username={username}
          onSearch={handleSearch}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading || isBulkSearching}
          onUsernameChange={setUsername}
        />

        <SearchButton
          isLoading={isLoading}
          isBulkSearching={isBulkSearching}
          username={username}
          hasReachedLimit={hasReachedLimit}
          requestCount={requestCount}
          maxRequests={maxRequests}
          onClick={handleSearch}
        />

        <SearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disabled={isLoading || isBulkSearching}
        />
      </div>

      {displayPosts.length > 0 && (
        <div className="w-full max-w-[90rem] space-y-8">
          <SearchFilters
            filters={filters}
            onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
            onReset={resetFilters}
            totalResults={displayPosts.length}
            filteredResults={displayPosts.length}
            currentPosts={displayPosts}
          />
          <div className="material-card overflow-hidden animate-in fade-in duration-300">
            <SearchResults posts={displayPosts} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};