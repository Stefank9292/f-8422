import { SearchHeaderSection } from "./sections/SearchHeaderSection";
import { SearchInputSection } from "./sections/SearchInputSection";
import { SearchResultsSection } from "./sections/SearchResultsSection";
import { AnnouncementBar } from "./AnnouncementBar";
import { useState } from "react";
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
  const { toast } = useToast();
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
      <SearchHeaderSection />
      <SearchInputSection
        username={username}
        isLoading={isLoading}
        isBulkSearching={isBulkSearching}
        hasReachedLimit={hasReachedLimit}
        requestCount={requestCount}
        maxRequests={maxRequests}
        onSearch={onSearchClick}
        onBulkSearch={handleBulkSearch}
        setUsername={setUsername}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        numberOfVideos={numberOfVideos}
        setNumberOfVideos={setNumberOfVideos}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <SearchResultsSection
        displayPosts={displayPosts}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
};