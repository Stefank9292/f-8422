import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterHeaderProps {
  totalResults: number;
  filteredResults: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const FilterHeader = ({ 
  totalResults, 
  filteredResults,
  isCollapsed,
  onToggleCollapse
}: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-card/50 border-b border-border/50">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Filter Results
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-6 w-6 p-0 hover:bg-transparent"
        >
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isCollapsed ? "" : "transform rotate-180"
          )} />
        </Button>
      </div>
      <span className="text-[10px] text-muted-foreground/70">
        Showing {filteredResults} of {totalResults} results
      </span>
    </div>
  );
};