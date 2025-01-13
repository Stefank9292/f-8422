import { useState, useEffect } from "react";
import { SearchFilters } from "../search/SearchFilters";
import { TablePagination } from "../search/TablePagination";
import { FilterState } from "@/utils/filterResults";
import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";
import { ResultsTableSection } from "./ResultsTableSection";
import { useSortResults } from "@/hooks/useSortResults";

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
}

export function FilteredResultsSection({
  results,
  filters,
  onFilterChange,
  onResetFilters,
  filteredResults: unfilteredResults,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
}: FilteredResultsSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("filterResultsCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const {
    sortKey,
    sortDirection,
    handleSort,
    sortedResults
  } = useSortResults(unfilteredResults);

  useEffect(() => {
    localStorage.setItem("filterResultsCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = sortedResults.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedResults.length / pageSize);

  return (
    <div className="mt-3 space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <SearchFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onResetFilters}
            totalResults={results.length}
            filteredResults={sortedResults.length}
            currentPosts={sortedResults}
          />
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:rounded-lg md:border md:border-border/50",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        )}
      >
        <div className="overflow-hidden">
          <ResultsTableSection
            currentPosts={currentPosts}
            handleSort={handleSort}
            handleCopyCaption={handleCopyCaption}
            handleDownload={handleDownload}
            formatNumber={formatNumber}
            truncateCaption={truncateCaption}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          totalResults={sortedResults.length}
        />
      </div>
    </div>
  );
}