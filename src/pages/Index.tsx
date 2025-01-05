import { SearchContainer } from "@/components/search/SearchContainer";
import { useSearchState } from "@/components/search/SearchState";

const Index = () => {
  const {
    username,
    isLoading,
    isBulkSearching,
    hasReachedLimit,
    requestCount,
    maxRequests,
    handleSearch,
    handleBulkSearch,
    displayPosts,
  } = useSearchState();

  return (
    <SearchContainer
      username={username}
      isLoading={isLoading}
      isBulkSearching={isBulkSearching}
      hasReachedLimit={hasReachedLimit}
      requestCount={requestCount}
      maxRequests={maxRequests}
      handleSearch={handleSearch}
      handleBulkSearch={handleBulkSearch}
      displayPosts={displayPosts}
    />
  );
};

export default Index;