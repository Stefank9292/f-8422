import { FilterHeader } from "./FilterHeader";
import { InstagramFilters } from "./instagram/InstagramFilters";
import { TikTokFilters } from "./tiktok/TikTokFilters";
import { FilterState } from "@/utils/filterResults";
import { usePlatformStore } from "@/store/platformStore";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
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
  const { platform } = usePlatformStore();
  const isMobile = useIsMobile();

  const FilterComponent = platform === 'instagram' ? InstagramFilters : TikTokFilters;

  const filterContent = (
    <>
      <FilterHeader
        totalResults={totalResults}
        filteredResults={filteredResults}
        onReset={onReset}
        currentPosts={currentPosts}
        isMobile={isMobile}
      />
      <div className={isMobile ? "" : "border-t border-border/50"}>
        <FilterComponent
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Collapsible>
        {filterContent}
      </Collapsible>
    );
  }

  return filterContent;
};