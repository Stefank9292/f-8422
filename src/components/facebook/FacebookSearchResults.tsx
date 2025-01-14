import { FacebookTableContent } from "./FacebookTableContent";
import { FacebookFilterHeader } from "./FacebookFilterHeader";
import { TablePagination } from "../search/TablePagination";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FilterInput } from "@/components/search/FilterInput";
import { Calendar, Heart, Eye, Share2, MessageSquare, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { parse } from "date-fns";

interface FacebookSearchResultsProps {
  searchResults?: any[];
}

export const FacebookSearchResults = ({ searchResults = [] }: FacebookSearchResultsProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const isMobile = useIsMobile();
  
  // Filter states
  const [date, setDate] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [minViews, setMinViews] = useState("");
  const [minShares, setMinShares] = useState("");
  const [minComments, setMinComments] = useState("");
  const [minEngagement, setMinEngagement] = useState("");
  const [isOpen, setIsOpen] = useState(!isMobile);

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  // Filter logic
  const filteredResults = searchResults.filter(post => {
    const dateMatch = date
      ? (() => {
          try {
            const selectedDate = parse(date, "dd.MM.yyyy", new Date());
            const postDate = new Date(post.uploadedAtFormatted);
            return postDate > selectedDate;
          } catch (error) {
            console.error('Error parsing date:', error);
            return true;
          }
        })()
      : true;

    const likesMatch = minLikes
      ? post.likes >= parseInt(minLikes)
      : true;

    const viewsMatch = minViews
      ? post.views >= parseInt(minViews)
      : true;

    const sharesMatch = minShares
      ? post.shares >= parseInt(minShares)
      : true;

    const commentsMatch = minComments
      ? post.comments >= parseInt(minComments)
      : true;

    const engagementMatch = minEngagement
      ? parseFloat(post.engagement) >= parseFloat(minEngagement)
      : true;

    return dateMatch && likesMatch && viewsMatch && 
           sharesMatch && commentsMatch && engagementMatch;
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
    setMinShares("");
    setMinComments("");
    setMinEngagement("");
  };

  if (!searchResults.length) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="animate-fade-in">
        <FacebookFilterHeader 
          totalResults={searchResults.length}
          filteredResults={filteredResults.length}
          onReset={handleReset}
          currentPosts={filteredResults}
          isMobile={isMobile}
        />
        
        <CollapsibleContent className="space-y-6 px-4 sm:px-6 py-6 bg-card/50 border-x border-b border-border/50 rounded-b-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              icon={Share2}
              label="Min. Shares"
              value={minShares}
              onChange={setMinShares}
              type="number"
              placeholder="e.g., 500"
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
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-8 animate-fade-in">
        <div className="rounded-xl overflow-hidden">
          <FacebookTableContent 
            currentPosts={currentPosts}
            handleCopyCaption={handleCopyCaption}
            formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
            truncateCaption={(caption) => caption}
          />
        </div>
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
  );
};