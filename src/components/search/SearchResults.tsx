import { TableContainer } from "../common/table/TableContainer";
import { FilterContainer } from "../common/filters/FilterContainer";
import { TableContent } from "./TableContent";
import { SearchFilters } from "./filters/SearchFilters";
import { SearchPagination } from "./pagination/SearchPagination";
import { ExportCSV } from "./ExportCSV";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  searchResults?: any[];
}

export const SearchResults = ({ searchResults = [] }: SearchResultsProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // Filter states
  const [date, setDate] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [minViews, setMinViews] = useState("");
  const [minPlays, setMinPlays] = useState("");
  const [minComments, setMinComments] = useState("");
  const [minEngagement, setMinEngagement] = useState("");

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const handleDownload = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  // Filter logic
  const filteredResults = searchResults.filter(post => {
    const dateMatch = date
      ? new Date(post.date) > new Date(date)
      : true;

    const likesMatch = minLikes
      ? post.likesCount >= parseInt(minLikes)
      : true;

    const viewsMatch = minViews
      ? post.viewsCount >= parseInt(minViews)
      : true;

    const playsMatch = minPlays
      ? post.playsCount >= parseInt(minPlays)
      : true;

    const commentsMatch = minComments
      ? post.commentsCount >= parseInt(minComments)
      : true;

    const engagementMatch = minEngagement
      ? parseFloat(post.engagement) >= parseFloat(minEngagement)
      : true;

    return dateMatch && likesMatch && viewsMatch && 
           playsMatch && commentsMatch && engagementMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredResults.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setDate("");
    setMinLikes("");
    setMinViews("");
    setMinPlays("");
    setMinComments("");
    setMinEngagement("");
  };

  if (!searchResults.length) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      <FilterContainer
        totalResults={searchResults.length}
        filteredResults={filteredResults.length}
        onReset={handleReset}
        currentPosts={filteredResults}
        exportComponent={<ExportCSV currentPosts={filteredResults} />}
      >
        <SearchFilters
          date={date}
          setDate={setDate}
          minLikes={minLikes}
          setMinLikes={setMinLikes}
          minViews={minViews}
          setMinViews={setMinViews}
          minPlays={minPlays}
          setMinPlays={setMinPlays}
          minComments={minComments}
          setMinComments={setMinComments}
          minEngagement={minEngagement}
          setMinEngagement={setMinEngagement}
        />
      </FilterContainer>

      <div className="space-y-8 animate-fade-in">
        <div className="rounded-xl overflow-hidden">
          <TableContainer>
            <TableContent 
              currentPosts={currentPosts}
              handleCopyCaption={handleCopyCaption}
              handleDownload={handleDownload}
              formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
              truncateCaption={(caption) => caption}
            />
          </TableContainer>
        </div>
        <SearchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          totalResults={filteredResults.length}
        />
      </div>
    </div>
  );
};