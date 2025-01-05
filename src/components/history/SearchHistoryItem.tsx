import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchResultDetails } from "./SearchResultDetails";
import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";

interface SearchHistoryItemProps {
  item: {
    id: string;
    search_query: string;
    created_at: string;
    search_results?: Array<{ results: InstagramPost[] }>;
  };
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function SearchHistoryItem({ item, onDelete, isDeleting }: SearchHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const results = item.search_results?.[0]?.results || [];

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">@{item.search_query}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {results.length} results found
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "transition-transform duration-200",
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
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
      
      {isExpanded && results.length > 0 && (
        <div className="pl-4 space-y-4 animate-fade-in">
          {results.map((result, index) => (
            <SearchResultDetails key={index} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}