import { useState, useEffect } from "react";
import { SearchFilters } from "../search/SearchFilters";
import { TableContent } from "../search/TableContent";
import { TablePagination } from "../search/TablePagination";
import { FilterState } from "@/utils/filterResults";
import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";

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
  sortKey,
  sortDirection,
  handleSort,
}: FilteredResultsSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("filterResultsCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const sortedResults = [...unfilteredResults].sort((a, b) => {
    if (!sortKey) return 0;

    let valueA = a[sortKey as keyof typeof a];
    let valueB = b[sortKey as keyof typeof b];

    if (sortKey === 'date' || sortKey === 'timestamp') {
      valueA = new Date(valueA as string).getTime();
      valueB = new Date(valueB as string).getTime();
    } else if (sortKey === 'engagement') {
      valueA = parseFloat((valueA as string).replace('%', ''));
      valueB = parseFloat((valueB as string).replace('%', ''));
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      // No conversion needed for numbers
    } else {
      valueA = String(valueA);
      valueB = String(valueB);
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1;
  });

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
          "overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        )}
      >
        <div className="rounded-lg overflow-hidden border border-border/50">
          <TableContent
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
};