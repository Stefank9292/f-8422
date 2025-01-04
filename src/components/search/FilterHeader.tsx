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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Filter Results</h2>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredResults} of {totalResults} results
        </span>
        <div className="flex items-center gap-2">
          <ExportCSV currentPosts={currentPosts} />
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};