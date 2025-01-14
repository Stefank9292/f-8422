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
    <div className="container max-w-screen-2xl mx-auto p-4 pt-20 md:pt-8 lg:pt-12 space-y-6 md:space-y-8">
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
    </div>
  );
};

export default Index;