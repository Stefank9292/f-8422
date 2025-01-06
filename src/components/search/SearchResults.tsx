import { PostTableHeader } from "./TableHeader";
import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useState } from "react";
import { useSearchStore } from "@/store/searchStore";
import { filterResults } from "@/utils/filterResults";
import { Table } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "./SearchFilters";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { filters, resetFilters } = useSearchStore();
  const { toast } = useToast();

  const filteredPosts = filterResults(searchResults, filters);
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      title: "Caption copied",
      description: "The caption has been copied to your clipboard.",
    });
  };

  const handleDownload = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const truncateCaption = (caption: string) => {
    return caption.length > 100 ? `${caption.substring(0, 100)}...` : caption;
  };

  return (
    <div className="space-y-6">
      <SearchFilters
        filters={filters}
        onFilterChange={(key, value) => {
          useSearchStore.setState({
            filters: { ...filters, [key]: value }
          });
        }}
        onReset={resetFilters}
        totalResults={searchResults.length}
        filteredResults={filteredPosts.length}
        currentPosts={currentPosts}
      />

      <div className="w-full">
        <div className="rounded-xl overflow-hidden border border-border">
          <Table>
            <PostTableHeader onSort={() => {}} />
            <TableContent 
              currentPosts={currentPosts}
              handleSort={() => {}}
              handleCopyCaption={handleCopyCaption}
              handleDownload={handleDownload}
              formatNumber={formatNumber}
              truncateCaption={truncateCaption}
            />
          </Table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalResults={filteredPosts.length}
        />
      </div>
    </div>
  );
};