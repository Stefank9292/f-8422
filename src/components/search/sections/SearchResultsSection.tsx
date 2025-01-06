import { SearchFilters } from "../SearchFilters";
import { SearchResults } from "../SearchResults";

interface SearchResultsSectionProps {
  displayPosts: any[];
  filters: any;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
}

export const SearchResultsSection = ({
  displayPosts,
  filters,
  setFilters,
  resetFilters,
}: SearchResultsSectionProps) => {
  if (displayPosts.length === 0) return null;

  return (
    <>
      <div className="w-full max-w-[90rem]">
        <SearchFilters
          filters={filters}
          onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
          onReset={resetFilters}
          totalResults={displayPosts.length}
          filteredResults={displayPosts.length}
          currentPosts={displayPosts}
        />
      </div>
      <div className="w-full max-w-[90rem] space-y-6 sm:space-y-8">
        <div className="material-card overflow-hidden animate-in fade-in duration-300">
          <SearchResults searchResults={displayPosts} />
        </div>
      </div>
    </>
  );
};