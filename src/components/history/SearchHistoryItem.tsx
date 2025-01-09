import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { InstagramPost } from "@/types/instagram";
import { SearchHistoryItemHeader } from "./SearchHistoryItemHeader";
import { FilteredResultsSection } from "./FilteredResultsSection";
import { filterResults, FilterState } from "@/utils/filterResults";

interface SearchHistoryItemProps {
  item: {
    id: string;
    search_query: string;
    created_at: string;
    bulk_search_urls?: string[];
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

  // Filter for valid clips only
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
           post.playsCount > 0 &&
           post.viewsCount > 0;
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const filteredResults = filterResults(results, filters);

  const isBulkSearch = item.bulk_search_urls && item.bulk_search_urls.length > 0;

  return (
    <div className="animate-fade-in">
      console.log('SearchHistoryItem data:', { 
        query: item.search_query,
        bulk_search_urls: item.bulk_search_urls,
        isBulkSearch
      });

      <SearchHistoryItemHeader
        query={item.search_query}
        date={item.created_at}
        resultsCount={results.length}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onDelete={() => onDelete(item.id)}
        isDeleting={isDeleting}
        isBulkSearch={isBulkSearch}
        urls={item.bulk_search_urls}
      />
      
      {isExpanded && results.length > 0 && (
        <FilteredResultsSection
          results={results}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          filteredResults={filteredResults}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          handleCopyCaption={handleCopyCaption}
          handleDownload={handleDownload}
          formatNumber={(num) => num.toLocaleString()}
          truncateCaption={(caption) => caption.length > 15 ? `${caption.slice(0, 15)}...` : caption}
          sortKey={sortKey}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
      )}
    </div>
  );
}