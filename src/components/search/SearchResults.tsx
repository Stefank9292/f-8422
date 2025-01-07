import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { filterResults } from "@/utils/filterResults";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { filters } = useSearchStore();
  const { toast } = useToast();

  useEffect(() => {
    console.log('SearchResults received:', searchResults);
  }, [searchResults]);

  // Apply filters to search results
  const filteredPosts = filterResults(searchResults, filters);
  console.log('Filtered posts:', filteredPosts);

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  console.log('Current posts to display:', currentPosts);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
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

  if (!searchResults || searchResults.length === 0) {
    console.log('No search results to display');
    return null;
  }

  return (
    <div className="w-full">
      <TableContent 
        currentPosts={currentPosts}
        handleCopyCaption={handleCopyCaption}
        handleDownload={handleDownload}
        formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
        truncateCaption={(caption) => caption}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalResults={filteredPosts.length}
      />
    </div>
  );
};