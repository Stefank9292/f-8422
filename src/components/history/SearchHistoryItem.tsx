import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";
import { SearchFilters } from "../search/SearchFilters";
import { TableContent } from "../search/TableContent";
import { TablePagination } from "../search/TablePagination";
import { useToast } from "@/hooks/use-toast";

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
  const results = item.search_results?.[0]?.results || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState({
    postsNewerThan: "",
    minViews: "",
    minPlays: "",
    minLikes: "",
    minComments: "",
    minDuration: "",
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
      minDuration: "",
      minEngagement: "",
    });
    setCurrentPage(1); // Reset to first page when filters are reset
  };

  const filteredResults = results.filter(post => {
    if (filters.postsNewerThan) {
      const filterDate = new Date(filters.postsNewerThan.split('.').reverse().join('-'));
      const postDate = new Date(post.timestamp);
      if (postDate < filterDate) return false;
    }
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) return false;
    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) return false;
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    if (filters.minDuration && post.duration < filters.minDuration) return false;
    if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;

    return true;
  });

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredResults.slice(startIndex, endIndex);

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
      <div className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-medium truncate">@{item.search_query}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(item.created_at), 'MMM d, HH:mm')}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({results.length})
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "h-8 w-8 p-0 transition-transform duration-200",
                isExpanded && "bg-accent"
              )}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
      
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
              handleSort={() => {}}
              handleCopyCaption={handleCopyCaption}
              handleDownload={handleDownload}
              formatNumber={formatNumber}
              truncateCaption={truncateCaption}
            />
          </div>
          {filteredResults.length > 25 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              totalResults={filteredResults.length}
            />
          )}
        </div>
      )}
    </div>
  );
}