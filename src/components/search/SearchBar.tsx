import { useState } from "react";
import { Search, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BulkSearch } from "./BulkSearch";

interface SearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
  onBulkSearch?: (urls: string[], numberOfVideos: number, selectedDate: Date | undefined) => Promise<any>;
  isLoading?: boolean;
}

export const SearchBar = ({ 
  username, 
  onUsernameChange, 
  onSearch,
  onBulkSearch,
  isLoading 
}: SearchBarProps) => {
  const [isBulkSearchOpen, setIsBulkSearchOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Enter Instagram username or profile URL"
          className="w-full pl-10 pr-32 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Button
          variant="ghost"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsBulkSearchOpen(true)}
          disabled={isLoading}
        >
          <List className="w-4 h-4" />
          <span>Bulk Search</span>
        </Button>
      </div>

      <BulkSearch
        isOpen={isBulkSearchOpen}
        onClose={() => setIsBulkSearchOpen(false)}
        onSearch={onBulkSearch || (() => Promise.resolve())}
        isLoading={isLoading}
      />
    </>
  );
};