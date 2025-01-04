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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-medium">Filter Results</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Showing {filteredResults} of {totalResults} results
        </span>
        <div className="flex items-center gap-2">
          <ExportCSV currentPosts={currentPosts} />
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};