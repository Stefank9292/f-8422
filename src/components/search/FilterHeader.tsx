import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCSV } from "./ExportCSV";

interface FilterHeaderProps {
  totalResults: number;
  filteredResults: number;
  onReset: () => void;
  currentPosts: any[];
}

export const FilterHeader = ({ totalResults, filteredResults, onReset, currentPosts }: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-base font-medium">Filter Results</h2>
        <span className="text-sm text-muted-foreground">
          Showing {filteredResults} of {totalResults} results
        </span>
      </div>
      <Button 
        variant="ghost" 
        onClick={onReset} 
        className="text-sm font-medium hover:bg-transparent hover:underline"
      >
        Reset
      </Button>
    </div>
  );
};