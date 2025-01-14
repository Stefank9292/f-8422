import { FilterContainer } from "@/components/common/filters/FilterContainer";
import { ResultsFilters } from "./ResultsFilters";
import { ResultsTable } from "./ResultsTable";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ResultsContainerProps {
  searchResults?: any[];
}

export const ResultsContainer = ({ searchResults = [] }: ResultsContainerProps) => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  if (!searchResults.length) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      <ResultsFilters
        searchResults={searchResults}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(value: string) => {
          setPageSize(Number(value));
          setCurrentPage(1);
        }}
        onCopyCaption={handleCopyCaption}
      />
    </div>
  );
};