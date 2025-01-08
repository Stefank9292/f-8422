import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { InstagramPost } from "@/types/instagram";
import { SearchFilters } from "../search/SearchFilters";
import { TableContent } from "../search/TableContent";
import { TablePagination } from "../search/TablePagination";
import { SearchHistoryItemHeader } from "./SearchHistoryItemHeader";
import { filterResults, FilterState } from "@/utils/filterResults";

interface SearchHistoryItemProps {
  item: {
    id: string;
    search_query: string;
    created_at: string;
    search_results?: Array<{ results: InstagramPost[] }>;
  };
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function SearchHistoryItem({ item, onDelete, isDeleting }: SearchHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Filter for valid clips only, remove undefined values and posts with 0 views/plays
  const allResults = item.search_results?.[0]?.results || [];
  const results = allResults.filter(post => {
    return post && 
           typeof post === 'object' && 
           post.ownerUsername && 
           post.caption && 
           post.playsCount !== undefined &&
           post.viewsCount !== undefined &&
           post.likesCount !== undefined &&
           post.commentsCount !== undefined &&
           post.engagement !== undefined &&
           // Filter out posts with 0 views or plays
           post.playsCount > 0 &&
           post.viewsCount > 0;
  });

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

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
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
        description: "Download started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        description: "Failed to download video",
      });
    }
  };

  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  const truncateCaption = (caption: string) => {
    return caption.length > 15 ? `${caption.slice(0, 15)}...` : caption;
  };

  const handleSort = (key: string) => {
    // If clicking the same column, toggle direction
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as the sort key and default to descending
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  // Apply sorting to filtered results
  const sortResults = (posts: InstagramPost[]) => {
    if (!sortKey) return posts;

    return [...posts].sort((a: any, b: any) => {
      if (sortKey === 'date') {
        const dateA = new Date(a[sortKey]).getTime();
        const dateB = new Date(b[sortKey]).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortKey === 'engagement') {
        // Convert engagement percentage strings to numbers for comparison
        const engagementA = parseFloat(a[sortKey].replace('%', ''));
        const engagementB = parseFloat(b[sortKey].replace('%', ''));
        return sortDirection === 'asc' ? engagementA - engagementB : engagementB - engagementA;
      }
      
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      return 0;
    });
  };

  const filteredResults = filterResults(results, filters);
  const sortedResults = sortResults(filteredResults);
  const totalPages = Math.ceil(sortedResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = sortedResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in">
      <SearchHistoryItemHeader
        query={item.search_query}
        date={item.created_at}
        resultsCount={results.length}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onDelete={() => onDelete(item.id)}
        isDeleting={isDeleting}
      />
      
      {isExpanded && results.length > 0 && (
        <div className="mt-3 space-y-4 animate-fade-in">
          <div className="px-1">
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={results.length}
              filteredResults={filteredResults.length}
              currentPosts={filteredResults}
            />
          </div>
          <div className="rounded-lg overflow-hidden">
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
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            totalResults={filteredResults.length}
          />
        </div>
      )}
    </div>
  );
}
