import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchHistoryItemHeaderProps {
  query: string;
  date: string;
  resultsCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isBulkSearch?: boolean;
  urls?: string[];
}

export function SearchHistoryItemHeader({
  query,
  date,
  resultsCount,
  isExpanded,
  onToggleExpand,
  onDelete,
  isDeleting,
  isBulkSearch,
  urls = []
}: SearchHistoryItemHeaderProps) {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isBulkSearch && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <List className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Bulk Search URLs:</p>
                    {urls.map((url, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        {url}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="font-medium truncate">{query}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(date), 'MMM d, HH:mm')}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            ({resultsCount})
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className={cn(
              "h-8 w-8 p-0 transition-transform duration-200",
              isExpanded && "bg-accent"
            )}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}