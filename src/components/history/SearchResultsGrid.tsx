import { InstagramPost } from "@/types/instagram";
import { SearchResultDetails } from "./SearchResultDetails";

interface SearchResultsGridProps {
  results: InstagramPost[];
}

export function SearchResultsGrid({ results }: SearchResultsGridProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <SearchResultDetails key={index} result={result} />
        ))}
      </div>
    </div>
  );
}