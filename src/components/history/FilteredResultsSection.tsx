import { InstagramFilters } from "../search/instagram/InstagramFilters";
import { TikTokFilteredResultsSection } from "../search/tiktok/TikTokFilteredResultsSection";
import { FilterState } from "@/utils/filterResults";
import { InstagramPost } from "@/types/instagram";
import { usePlatformStore } from "@/store/platformStore";
import { TableContent } from "../search/TableContent";
import { TablePagination } from "../search/TablePagination";

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
  const totalPages = Math.ceil(props.filteredResults.length / props.pageSize);
  const startIndex = (props.currentPage - 1) * props.pageSize;
  const endIndex = startIndex + props.pageSize;
  const currentPosts = props.filteredResults.slice(startIndex, endIndex);

  if (platform === 'tiktok') {
    return (
      <TikTokFilteredResultsSection
        filters={props.filters}
        onFilterChange={props.onFilterChange}
        onReset={props.onResetFilters}
        totalResults={props.results.length}
        filteredResults={props.filteredResults.length}
      />
    );
  }

  return (
    <div className="mt-3 space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <InstagramFilters
            filters={props.filters}
            onFilterChange={props.onFilterChange}
          />
        </div>

        <div className="w-full">
          <TableContent
            currentPosts={currentPosts}
            handleCopyCaption={props.handleCopyCaption}
            handleDownload={props.handleDownload}
            formatNumber={props.formatNumber}
            truncateCaption={props.truncateCaption}
            sortKey={props.sortKey}
            sortDirection={props.sortDirection}
            handleSort={props.handleSort}
          />
        </div>

        <TablePagination
          currentPage={props.currentPage}
          totalPages={totalPages}
          pageSize={props.pageSize}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
          totalResults={props.filteredResults.length}
        />
      </div>
    </div>
  );
}