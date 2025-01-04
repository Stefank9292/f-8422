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
      e.preventDefault(); // Prevent form submission
      onSearch();
    }
  };

  return (
    <>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter Instagram username or profile URL"
          className="pl-10 pr-32"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Button
          variant="ghost"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-600"
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