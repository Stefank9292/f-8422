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
  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(searchQuery)}
        className="text-[11px] text-muted-foreground hover:text-primary font-medium 
                   bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
      >
        @{searchQuery}
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