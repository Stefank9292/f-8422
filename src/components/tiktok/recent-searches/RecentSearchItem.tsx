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
  // Extract username for display and format URL for search
  const formatForDisplay = (query: string): string => {
    try {
      // Handle full TikTok URLs
      if (query.includes('tiktok.com/')) {
        const match = query.match(/@([^/?]+)/);
        if (match) return `@${match[1]}`;
      }
      
      // Handle raw username or @username
      const username = query.replace('https://www.tiktok.com/', '');
      return username.startsWith('@') ? username : `@${username}`;
    } catch {
      return query.startsWith('@') ? query : `@${query}`;
    }
  };

  const formatForSearch = (query: string): string => {
    try {
      // If it's already a full URL, return it
      if (query.includes('tiktok.com/')) {
        // Ensure the @ symbol is present in the URL
        if (query.includes('tiktok.com/@')) return query;
        return query.replace('tiktok.com/', 'tiktok.com/@');
      }

      // Handle @username or raw username
      const username = query.startsWith('@') ? query : `@${query}`;
      return `https://www.tiktok.com/${username}`;
    } catch {
      // Fallback to constructing a proper URL
      const username = query.startsWith('@') ? query : `@${query}`;
      return `https://www.tiktok.com/${username}`;
    }
  };

  const displayUsername = formatForDisplay(searchQuery);
  
  const handleSelect = () => {
    const formattedUrl = formatForSearch(searchQuery);
    console.log('Formatted URL for search:', formattedUrl);
    onSelect(formattedUrl);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm">
      <TikTokIcon className="w-3.5 h-3.5" />
      <button
        onClick={handleSelect}
        className="text-[11px] font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1"
      >
        {displayUsername}
      </button>
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