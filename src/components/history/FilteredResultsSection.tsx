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
  filteredResults,
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

  useEffect(() => {
    localStorage.setItem("filterResultsCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredResults.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResults.length / pageSize);

  return (
    <div className="mt-3 space-y-4 animate-fade-in">
      <div className="material-card border border-border/50">
        <SearchFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onResetFilters}
          totalResults={results.length}
          filteredResults={filteredResults.length}
          currentPosts={filteredResults}
        />

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
          )}
        >
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
      </div>
      
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalResults={filteredResults.length}
      />
    </div>
  );
}