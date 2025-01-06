import { useState } from "react";
import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "./SearchFilters";
import { filterResults, FilterState } from "@/utils/filterResults";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<FilterState>({
    postsNewerThan: "",
    minViews: "",
    minPlays: "",
    minLikes: "",
    minComments: "",
    minEngagement: "",
  });
  
  // Filter out results with 0 views or plays before setting initial state
  const validResults = searchResults.filter(post => 
    post.playsCount > 0 && post.viewsCount > 0
  );
  const [sortedResults, setSortedResults] = useState([...validResults]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentSortKey, setCurrentSortKey] = useState<string>("");
  const { toast } = useToast();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      postsNewerThan: "",
      minViews: "",
      minPlays: "",
      minLikes: "",
      minComments: "",
      minEngagement: "",
    });
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    const newDirection = currentSortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setCurrentSortKey(key);

    const sorted = [...sortedResults].sort((a, b) => {
      let comparison = 0;
      
      if (key === 'date') {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        comparison = dateA - dateB;
      } else if (key === 'engagement') {
        const engA = parseFloat(a[key]);
        const engB = parseFloat(b[key]);
        comparison = engA - engB;
      } else {
        comparison = a[key] - b[key];
      }

      return newDirection === "asc" ? comparison : -comparison;
    });

    setSortedResults(sorted);
  };

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const handleDownload = async (videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        description: "Video download started",
      });
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        variant: "destructive",
        description: "Failed to download video",
      });
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const truncateCaption = (caption: string): string => {
    return caption.length > 100 ? `${caption.substring(0, 100)}...` : caption;
  };

  // Apply filters to the sorted results
  const filteredResults = filterResults(sortedResults, filters);
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredResults.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-4">
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={validResults.length}
        filteredResults={filteredResults.length}
        currentPosts={currentPosts}
      />
      <TableContent
        currentPosts={currentPosts}
        handleSort={handleSort}
        handleCopyCaption={handleCopyCaption}
        handleDownload={handleDownload}
        formatNumber={formatNumber}
        truncateCaption={truncateCaption}
        sortKey={currentSortKey}
        sortDirection={sortDirection}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredResults.length / pageSize)}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        totalResults={filteredResults.length}
      />
    </div>
  );
};