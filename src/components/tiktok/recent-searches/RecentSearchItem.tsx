import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

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
      let username = query;
      
      // Handle full TikTok URLs
      if (query.includes('tiktok.com/')) {
        const match = query.match(/@([^/?]+)/);
        username = match ? match[1] : query;
      } else {
        // Handle @username format or raw username
        username = query.startsWith('@') ? query.substring(1) : query;
      }

      // Ensure username starts with @
      return username.startsWith('@') ? username : `@${username}`;
    } catch {
      // Fallback to original query with @ if something goes wrong
      return query.startsWith('@') ? query : `@${query}`;
    }
  };

  const displayUsername = formatUsername(searchQuery);

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm">
      <TikTokIcon className="w-3.5 h-3.5" />
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelect(searchQuery)}
          className="text-[11px] font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1"
        >
          {displayUsername}
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