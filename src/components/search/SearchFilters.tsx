import { Calendar, Eye, Play, Heart, MessageCircle, Clock, Zap } from "lucide-react";
import { FilterHeader } from "./FilterHeader";
import { FilterInput } from "./FilterInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FiltersType {
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minDuration: string;
  minEngagement: string;
  postsNewerThan: string;
}

interface SearchFiltersProps {
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: string) => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
  currentPosts: any[];
}

export const SearchFilters = ({ 
  filters, 
  onFilterChange, 
  onReset,
  totalResults,
  filteredResults,
  currentPosts
}: SearchFiltersProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 animate-in fade-in">
      <FilterHeader
        totalResults={totalResults}
        filteredResults={filteredResults}
        onReset={onReset}
        currentPosts={currentPosts}
      />

      <div className={cn(
        "grid gap-4 bg-card/50 p-4 rounded-lg",
        isMobile ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}>
        <FilterInput
          icon={Calendar}
          label="Posts newer than"
          value={filters.postsNewerThan}
          onChange={(value) => onFilterChange('postsNewerThan', value)}
          placeholder="dd.mm.yyyy"
          helpText="Limited to posts from the last 90 days"
          isDatePicker={true}
        />

        <FilterInput
          icon={Eye}
          label="Minimum Views"
          value={filters.minViews}
          onChange={(value) => onFilterChange('minViews', value)}
          placeholder="e.g. 10000"
          type="number"
        />

        <FilterInput
          icon={Play}
          label="Minimum Plays"
          value={filters.minPlays}
          onChange={(value) => onFilterChange('minPlays', value)}
          placeholder="e.g. 5000"
          type="number"
        />

        <FilterInput
          icon={Heart}
          label="Minimum Likes"
          value={filters.minLikes}
          onChange={(value) => onFilterChange('minLikes', value)}
          placeholder="e.g. 1000"
          type="number"
        />

        <FilterInput
          icon={MessageCircle}
          label="Minimum Comments"
          value={filters.minComments}
          onChange={(value) => onFilterChange('minComments', value)}
          placeholder="e.g. 100"
          type="number"
        />

        <FilterInput
          icon={Clock}
          label="Minimum Duration"
          value={filters.minDuration}
          onChange={(value) => onFilterChange('minDuration', value)}
          placeholder="e.g. 30"
        />

        <FilterInput
          icon={Zap}
          label="Minimum Engagement"
          value={filters.minEngagement}
          onChange={(value) => onFilterChange('minEngagement', value)}
          placeholder="e.g. 5"
        />
      </div>
    </div>
  );
};