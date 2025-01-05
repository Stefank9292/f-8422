import { useState } from "react";
import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedResults, setSortedResults] = useState([...searchResults]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentSortKey, setCurrentSortKey] = useState<string>("");
  const { toast } = useToast();
  
  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedResults.slice(indexOfFirstPost, indexOfLastPost);

  const handleSort = (key: string) => {
    const isAsc = currentSortKey === key ? !sortDirection : true;
    setSortDirection(isAsc ? "asc" : "desc");
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

      return isAsc ? comparison : -comparison;
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

  return (
    <div className="space-y-4">
      <TableContent
        currentPosts={currentPosts}
        handleSort={handleSort}
        handleCopyCaption={handleCopyCaption}
        handleDownload={handleDownload}
        formatNumber={formatNumber}
        truncateCaption={truncateCaption}
      />
      <TablePagination
        currentPage={currentPage}
        totalPosts={sortedResults.length}
        postsPerPage={postsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};