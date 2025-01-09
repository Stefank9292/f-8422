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
  const [requestCount] = useState(0);
  const [maxRequests] = useState(100);
  const [displayPosts] = useState<any[]>([]);

  const handleSearch = () => {
    setIsSearching(true);
    // ... implement search logic
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    setIsBulkSearching(true);
    // ... implement bulk search logic
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
        displayPosts={displayPosts}
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