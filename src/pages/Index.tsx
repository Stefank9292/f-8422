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

  return (
    <div>
      <SearchContainer 
        username={username}
        isLoading={isSearching}
        isBulkSearching={isBulkSearching}
        hasReachedLimit={hasReachedLimit}
        onUsernameChange={setUsername}
        onSearch={() => {
          setIsSearching(true);
          // ... implement search logic
        }}
        onBulkSearch={() => {
          setIsBulkSearching(true);
          // ... implement bulk search logic
        }}
        onClearSearch={() => {
          setUsername("");
          setSearchHistoryId(null);
          setError(null);
        }}
        onError={setError}
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