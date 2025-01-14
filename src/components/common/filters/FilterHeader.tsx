import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";

interface FilterHeaderProps {
  totalResults: number;
  filteredResults: number;
  onReset: () => void;
  currentPosts: any[];
  isMobile: boolean;
  exportComponent?: React.ReactNode;
}

export const FilterHeader = ({ 
  totalResults, 
  filteredResults, 
  onReset,
  currentPosts,
  isMobile,
  exportComponent
}: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-card/50 backdrop-blur-sm 
                    border border-border/50 rounded-t-xl shadow-sm">
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredResults}</span> of <span className="font-medium text-foreground">{totalResults}</span> results
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-secondary/50 transition-colors duration-200"
          onClick={onReset}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {exportComponent}
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] font-medium hover:bg-secondary/50 transition-colors duration-200
                       border border-border/50 rounded-lg"
          >
            {isMobile ? (
              <>
                Filters
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            ) : (
              <>
                Advanced Filters
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  );
};