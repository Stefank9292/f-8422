import { SearchContainer } from "@/components/search/SearchContainer";
import { SearchState } from "@/components/search/SearchState";
import { useState } from "react";

const Index = () => {
  const [searchHistoryId, setSearchHistoryId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [username, setUsername] = useState("");
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [maxRequests] = useState(100); // Default max requests, adjust as needed

  const handleSearch = () => {
    // Implementation will be added when needed
    console.log("Search initiated");
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    // Implementation will be added when needed
    console.log("Bulk search initiated", { urls, numVideos, date });
  };

  return (
    <div>
      <SearchContainer 
        username={username}
        isLoading={isSearching}
        isBulkSearching={isBulkSearching}
        hasReachedLimit={hasReachedLimit}
        requestCount={requestCount}
        maxRequests={maxRequests}
        handleSearch={handleSearch}
        handleBulkSearch={handleBulkSearch}
        displayPosts={[]}
      />
      <SearchState 
        searchHistoryId={searchHistoryId}
        error={error}
        isSearching={isSearching}
      />
    </div>
  );
};

export default Index;