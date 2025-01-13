import { Instagram, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isTikTokUrl } from "@/utils/tiktok/validation";
import { formatDistanceToNow } from "date-fns";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

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
  urls
}: SearchHistoryItemHeaderProps) {
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
  const isTikTok = isTikTokUrl(query);

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          {isTikTok ? (
            <TikTokIcon className="w-4 h-4 text-[#ff0050]" />
          ) : (
            <Instagram className="w-4 h-4 text-[#E1306C]" />
          )}
          <span className="text-sm font-medium">
            {query}
          </span>
          <span className="text-xs text-muted-foreground">
            {timeAgo}
          </span>
          <span className="text-xs text-muted-foreground">
            {resultsCount} results
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
          )}
        </Button>
      </div>
    </div>
  );
}