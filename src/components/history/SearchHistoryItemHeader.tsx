import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BulkSearchInfo } from "./BulkSearchInfo";

interface SearchHistoryItemHeaderProps {
  query: string;
  date: string;
  resultsCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  bulkSearchUrls?: string[];
}

export function SearchHistoryItemHeader({
  query,
  date,
  resultsCount,
  isExpanded,
  onToggleExpand,
  onDelete,
  isDeleting,
  bulkSearchUrls
}: SearchHistoryItemHeaderProps) {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-medium truncate">@{query}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(date), 'MMM d, HH:mm')}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            ({resultsCount})
          </span>
          <BulkSearchInfo urls={bulkSearchUrls || []} />
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