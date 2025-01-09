import { SearchContainer } from "@/components/search/SearchContainer";
import { SearchState } from "@/components/search/SearchState";
import { useState } from "react";

const Index = () => {
  const [searchHistoryId, setSearchHistoryId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div>
      <SearchContainer />
      <SearchState 
        searchHistoryId={searchHistoryId}
        error={error}
        isSearching={isSearching}
      />
    </div>
  );
};

export default Index;