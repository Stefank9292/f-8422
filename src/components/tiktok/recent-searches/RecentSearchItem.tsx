import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentSearchItemProps {
  id: string;
  searchQuery: string;
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
}

export const RecentSearchItem = ({ 
  id, 
  searchQuery, 
  onSelect, 
  onRemove 
}: RecentSearchItemProps) => {
  // Extract username from TikTok URL or use the query as is
  const formatUsername = (query: string): string => {
    try {
      // Handle full TikTok URLs
      if (query.includes('tiktok.com/')) {
        const match = query.match(/@([^/?]+)/);
        return match ? match[1] : query;
      }
      // Handle @username format
      return query.startsWith('@') ? query.substring(1) : query;
    } catch {
      return query;
    }
  };

  const displayUsername = formatUsername(searchQuery);

  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(searchQuery)}
        className="text-[11px] text-muted-foreground hover:text-primary font-medium 
                   bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
      >
        @{displayUsername}
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-1 -top-1 h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 
                   transition-opacity bg-muted hover:bg-destructive/90 hover:text-destructive-foreground"
        onClick={() => onRemove(id)}
      >
        <X className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
};