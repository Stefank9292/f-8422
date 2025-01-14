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
  const extractUsername = (query: string): string => {
    if (query.includes('tiktok.com/')) {
      const username = query.split('tiktok.com/')[1]?.split('/')[0];
      return `@${username?.replace('@', '')}`;
    }
    return query.startsWith('@') ? query : `@${query}`;
  };

  const formatTikTokUrl = (query: string): string => {
    let username = query;
    if (query.includes('tiktok.com/')) {
      username = query.split('tiktok.com/')[1]?.split('/')[0] || '';
    }
    username = username.replace('@', '');
    return `https://www.tiktok.com/@${username}`;
  };

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm">
      <TikTokIcon className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" />
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelect(formatTikTokUrl(searchQuery))}
          className="text-[11px] font-medium text-gray-800 dark:text-gray-200"
        >
          {extractUsername(searchQuery)}
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