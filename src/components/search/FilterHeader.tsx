import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCSV } from "./ExportCSV";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FilterHeaderProps {
  totalResults: number;
  filteredResults: number;
  onReset: () => void;
  currentPosts: any[];
}

export const FilterHeader = ({ totalResults, filteredResults, onReset, currentPosts }: FilterHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex items-center justify-between gap-3 px-3 py-2.5 bg-card/50 rounded-lg",
      isMobile ? "flex-col" : "flex-row"
    )}>
      <div className="flex items-center gap-1.5">
        <Filter className="w-3.5 h-3.5 text-primary/70" />
        <h2 className="text-xs font-medium text-muted-foreground">Filter Results</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/70">
          Showing {filteredResults} of {totalResults} results
        </span>
        <div className="flex items-center gap-1.5">
          <ExportCSV currentPosts={currentPosts} />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset} 
            className="h-6 px-2 text-[10px] font-medium hover:bg-secondary/50"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};