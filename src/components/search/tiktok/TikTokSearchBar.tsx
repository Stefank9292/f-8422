import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { usePlaceholderAnimation } from "../PlaceholderAnimation";

interface TikTokSearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  hasReachedLimit?: boolean;
}

export const TikTokSearchBar = ({ 
  username, 
  onUsernameChange, 
  onSearch,
  isLoading,
  hasReachedLimit = false
}: TikTokSearchBarProps) => {
  const placeholder = usePlaceholderAnimation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && username.trim() && !hasReachedLimit) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-12 h-10 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                 focus:border-[#D946EF] shadow-sm
                 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || hasReachedLimit}
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>
  );
};