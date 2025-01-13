import { useState, useEffect } from "react";
import { TikTokSearchFilters } from "./TikTokSearchFilters";
import { TikTokTableContent } from "./TikTokTableContent";
import { TikTokTablePagination } from "./TikTokTablePagination";
import { cn } from "@/lib/utils";

interface TikTokFilterState {
  postsNewerThan: string;
  minViews: string;
  minLikes: string;
  minComments: string;
  minShares: string;
}

interface TikTokPost {
  id: string;
  username: string;
  caption: string;
  date: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  videoUrl: string;
}

interface TikTokFilteredResultsSectionProps {
  results: TikTokPost[];
  onFilterChange: (key: keyof TikTokFilterState, value: string) => void;
  onResetFilters: () => void;
  filters: TikTokFilterState;
}

export function TikTokFilteredResultsSection({
  results,
  filters,
  onFilterChange,
  onResetFilters,
}: TikTokFilteredResultsSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("tikTokFilterResultsCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    localStorage.setItem("tikTokFilterResultsCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('de-DE').replace(/,/g, '.');
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <div className="mt-3 space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <TikTokSearchFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onResetFilters}
            totalResults={results.length}
            filteredResults={results.length}
            currentPosts={results}
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
          <TikTokTableContent
            currentPosts={currentPosts}
            handleSort={handleSort}
            formatNumber={formatNumber}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </div>
        <TikTokTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalResults={results.length}
        />
      </div>
    </div>
  );
}