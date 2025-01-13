import { InstagramFilters } from "../search/instagram/InstagramFilters";
import { TikTokFilteredResultsSection } from "../search/tiktok/TikTokFilteredResultsSection";
import { FilterState } from "@/utils/filterResults";
import { InstagramPost } from "@/types/instagram";
import { usePlatformStore } from "@/store/platformStore";

interface FilteredResultsSectionProps {
  results: InstagramPost[];
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  filteredResults: InstagramPost[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
  sortKey: string;
  sortDirection: "asc" | "desc";
  handleSort: (key: string) => void;
}

export function FilteredResultsSection(props: FilteredResultsSectionProps) {
  const { platform } = usePlatformStore();

  if (platform === 'tiktok') {
    return <TikTokFilteredResultsSection {...props} />;
  }

  return (
    <div className="mt-3 space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <InstagramFilters
            filters={props.filters}
            onFilterChange={props.onFilterChange}
            onReset={props.onResetFilters}
            totalResults={props.results.length}
            filteredResults={props.filteredResults.length}
            currentPosts={props.filteredResults}
          />
        </div>
      </div>
    </div>
  );
}