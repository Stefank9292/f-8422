import { FilterHeader } from "./FilterHeader";
import { FilterInput } from "./FilterInput";
import { FilterState } from "@/utils/filterResults";
import { InstagramPost } from "@/types/instagram";

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
  currentPosts: InstagramPost[];
}

export function SearchFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  filteredResults,
  currentPosts,
}: SearchFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterHeader
        totalResults={totalResults}
        filteredResults={filteredResults}
        onReset={onReset}
      />
      <div className="rounded-xl border border-border">
        <div className="grid grid-cols-6 gap-6 p-6">
          <FilterInput
            label="Username"
            value={filters.username}
            onChange={(value) => onFilterChange("username", value)}
            placeholder="Filter by username..."
          />
          <FilterInput
            label="Min. Plays"
            value={filters.minPlays}
            onChange={(value) => onFilterChange("minPlays", value)}
            placeholder="Min plays count..."
            type="number"
          />
          <FilterInput
            label="Min. Views"
            value={filters.minViews}
            onChange={(value) => onFilterChange("minViews", value)}
            placeholder="Min views count..."
            type="number"
          />
          <FilterInput
            label="Min. Likes"
            value={filters.minLikes}
            onChange={(value) => onFilterChange("minLikes", value)}
            placeholder="Min likes count..."
            type="number"
          />
          <FilterInput
            label="Min. Comments"
            value={filters.minComments}
            onChange={(value) => onFilterChange("minComments", value)}
            placeholder="Min comments count..."
            type="number"
          />
          <FilterInput
            label="Min. Engagement"
            value={filters.minEngagement}
            onChange={(value) => onFilterChange("minEngagement", value)}
            placeholder="Min engagement rate..."
            type="number"
          />
        </div>
      </div>
    </div>
  );
}