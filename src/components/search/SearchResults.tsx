import { TableContainer } from "../common/table/TableContainer";
import { FilterContainer } from "../common/filters/FilterContainer";
import { TablePagination } from "./TablePagination";
import { FilterInput } from "./FilterInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Heart, Eye, Play, MessageSquare, Zap } from "lucide-react";
import { TableContent } from "./TableContent";
import { ExportCSV } from "./ExportCSV";

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
        <FilterInput
          icon={Calendar}
          label="Posts newer than"
          value={date}
          onChange={setDate}
          placeholder="DD.MM.YYYY"
          isDatePicker
        />
        <FilterInput
          icon={Eye}
          label="Min. Views"
          value={minViews}
          onChange={setMinViews}
          type="number"
          placeholder="e.g., 10000"
        />
        <FilterInput
          icon={Play}
          label="Min. Plays"
          value={minPlays}
          onChange={setMinPlays}
          type="number"
          placeholder="e.g., 5000"
        />
        <FilterInput
          icon={Heart}
          label="Min. Likes"
          value={minLikes}
          onChange={setMinLikes}
          type="number"
          placeholder="e.g., 1000"
        />
        <FilterInput
          icon={MessageSquare}
          label="Min. Comments"
          value={minComments}
          onChange={setMinComments}
          type="number"
          placeholder="e.g., 100"
        />
        <FilterInput
          icon={Zap}
          label="Min. Engagement (%)"
          value={minEngagement}
          onChange={setMinEngagement}
          type="number"
          placeholder="e.g., 5.5"
        />
      </FilterContainer>

      <div className="space-y-8 animate-fade-in">
        <div className="rounded-xl overflow-hidden">
          <TableContainer>
            <TableContent 
              currentPosts={currentPosts}
              handleCopyCaption={handleCopyCaption}
              formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
              truncateCaption={(caption) => caption}
            />
          </TableContainer>
        </div>
        <div className="border-t border-border/50 pt-8 bg-transparent">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalResults={filteredResults.length}
          />
        </div>
      </div>
    </div>
  );
};