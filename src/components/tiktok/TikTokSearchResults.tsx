import { TikTokTableContent } from "./TikTokTableContent";
import { TikTokFilterHeader } from "./TikTokFilterHeader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TikTokSearchResultsProps {
  searchResults?: any[];
}

export const TikTokSearchResults = ({ searchResults = [] }: TikTokSearchResultsProps) => {
  const { toast } = useToast();
  const [currentPage] = useState(1);
  const [pageSize] = useState(25);

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE').replace(/,/g, '.');
  };

  const truncateCaption = (caption: string) => caption;

  if (!searchResults.length) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <TikTokFilterHeader 
        totalResults={searchResults.length}
        filteredResults={searchResults.length}
        onReset={() => {}}
        currentPosts={searchResults}
      />
      <TikTokTableContent 
        currentPosts={searchResults}
        handleCopyCaption={handleCopyCaption}
        formatNumber={formatNumber}
        truncateCaption={truncateCaption}
      />
    </div>
  );
};