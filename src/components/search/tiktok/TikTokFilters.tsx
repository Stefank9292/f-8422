import { FilterInput } from "../FilterInput";
import { FilterState } from "@/utils/filterResults";

interface TikTokFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

export const TikTokFilters = ({ filters, onFilterChange }: TikTokFiltersProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      <FilterInput
        label="Min. Views"
        value={filters.minViews}
        onChange={(value) => onFilterChange('minViews', value)}
        placeholder="e.g., 1.000"
      />
      <FilterInput
        label="Min. Shares"
        value={filters.minShares}
        onChange={(value) => onFilterChange('minShares', value)}
        placeholder="e.g., 100"
      />
      <FilterInput
        label="Min. Likes"
        value={filters.minLikes}
        onChange={(value) => onFilterChange('minLikes', value)}
        placeholder="e.g., 1.000"
      />
      <FilterInput
        label="Min. Comments"
        value={filters.minComments}
        onChange={(value) => onFilterChange('minComments', value)}
        placeholder="e.g., 100"
      />
      <FilterInput
        label="Min. Engagement"
        value={filters.minEngagement}
        onChange={(value) => onFilterChange('minEngagement', value)}
        placeholder="e.g., 5.5"
        type="number"
        step="0.1"
      />
      <FilterInput
        label="Posts Newer Than"
        value={filters.postsNewerThan}
        onChange={(value) => onFilterChange('postsNewerThan', value)}
        type="date"
      />
    </div>
  );
};