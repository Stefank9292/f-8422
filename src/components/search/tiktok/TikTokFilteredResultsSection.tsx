import { FilterState } from "@/utils/filterResults";
import { TikTokFilters } from "./TikTokFilters";

interface TikTokFilteredResultsSectionProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
}

export const TikTokFilteredResultsSection = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  filteredResults,
}: TikTokFilteredResultsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredResults} of {totalResults} results
        </div>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:text-primary/80"
        >
          Reset Filters
        </button>
      </div>
      <TikTokFilters filters={filters} onFilterChange={onFilterChange} />
    </div>
  );
};