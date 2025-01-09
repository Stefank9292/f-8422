import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2, List, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const { toast } = useToast();
  
  // Extract username from Instagram URL
  const extractUsername = (url: string): string => {
    try {
      const username = url.split('instagram.com/')[1]?.split('/')[0];
      return username ? username.replace('@', '') : query;
    } catch {
      return query;
    }
  };

  const handleCopyUrls = () => {
    if (urls.length) {
      navigator.clipboard.writeText(urls.join('\n'));
      toast({
        description: "URLs copied to clipboard",
      });
    }
  };

  const displayQuery = isBulkSearch && urls.length > 0
    ? `@${extractUsername(urls[0])} +${urls.length - 1}`
    : query.startsWith('@') ? query : `@${extractUsername(query)}`;

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isBulkSearch && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">View bulk search URLs</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Bulk Search URLs ({urls.length})</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleCopyUrls}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy URLs</span>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {urls.map((url, index) => (
                      <p key={index} className="text-xs text-muted-foreground break-all">
                        {url}
                      </p>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          <span className="font-medium truncate">{displayQuery}</span>
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