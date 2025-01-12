import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCSV } from "./ExportCSV";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface FilterHeaderProps {
  totalResults: number;
  filteredResults: number;
  onReset: () => void;
  currentPosts: any[];
  isMobile?: boolean;
}

export const FilterHeader = ({ totalResults, filteredResults, onReset, currentPosts, isMobile }: FilterHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 pt-6 pb-3 bg-card/50 border-x border-t border-border/50">
      {isMobile ? (
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between p-4 border-x border-b border-border/50"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter Results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Showing {filteredResults} of {totalResults}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
      ) : (
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-primary/70" />
          <h2 className="text-xs font-medium text-muted-foreground">Filter Results</h2>
          <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">
            Showing {filteredResults} of {totalResults} results
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <ExportCSV currentPosts={currentPosts} />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset} 
            className="h-6 px-2 text-[10px] font-medium hover:bg-secondary/50 border border-border/50 w-full sm:w-auto"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};