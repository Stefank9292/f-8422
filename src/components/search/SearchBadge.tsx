import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBadgeProps } from "./types/searchTypes";
import { getSearchIcon } from "./utils/searchUtils";
import { BulkSearchHoverCard } from "./BulkSearchHoverCard";

export const SearchBadge = ({ 
  id, 
  searchQuery, 
  searchType, 
  bulkSearchUrls = [], 
  onSelect, 
  onRemove 
}: SearchBadgeProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelect(searchQuery)}
          className="text-[11px] font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1"
        >
          {getSearchIcon(searchType)}
          {searchQuery}
          {bulkSearchUrls?.length > 0 && (
            <BulkSearchHoverCard 
              urls={bulkSearchUrls} 
              onCopyUrls={(urls) => navigator.clipboard.writeText(urls.join('\n'))} 
            />
          )}
        </button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 hover:bg-transparent"
        onClick={() => onRemove(id)}
      >
        <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        <span className="sr-only">Remove search</span>
      </Button>
    </div>
  );
};