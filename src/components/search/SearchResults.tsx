import { PostTableHeader } from "./TableHeader";
import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { useState } from "react";
import { useSearchStore } from "@/store/searchStore";
import { filterResults } from "@/utils/filterResults";
import { Table } from "@/components/ui/table";

interface SearchResultsProps {
  searchResults: any[];
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { filters } = useSearchStore();

  const filteredPosts = filterResults(searchResults, filters);
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handleSort = () => {
    // Implement sorting logic here if needed
  };

  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden border border-border">
        <Table>
          <PostTableHeader onSort={handleSort} />
          <TableContent 
            currentPosts={currentPosts}
            handleSort={() => {}}
            handleCopyCaption={() => {}}
            handleDownload={() => {}}
            formatNumber={(num) => num.toString()}
            truncateCaption={(caption) => caption}
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
  );
};