import { Input } from "@/components/ui/input";
import { BulkSearchButton } from "./BulkSearchButton";
import { BulkSearch } from "./BulkSearch";
import { useState } from "react";

interface SearchBarProps {
  username: string;
  onSearch: () => void;
  onBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<void>;
  isLoading: boolean;
  onUsernameChange: (username: string) => void;
  isDisabled?: boolean;
  requestCount?: number;
  maxRequests?: number;
}

export const SearchBar = ({ 
  username, 
  onSearch, 
  onBulkSearch, 
  isLoading, 
  onUsernameChange,
  isDisabled = false,
  requestCount = 0,
  maxRequests = 0
}: SearchBarProps) => {
  const [isBulkSearchOpen, setIsBulkSearchOpen] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && !isDisabled) {
      onSearch();
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Enter Instagram username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || isDisabled}
        className="w-full h-10 pl-4 pr-24 text-[11px] sm:text-xs bg-background border-input focus:ring-2 focus:ring-primary/20 rounded-xl"
      />
      <BulkSearchButton
        isEnabled={true}
        isLoading={isLoading}
        onClick={() => setIsBulkSearchOpen(true)}
      />
      <BulkSearch
        isOpen={isBulkSearchOpen}
        onClose={() => setIsBulkSearchOpen(false)}
        onSearch={onBulkSearch}
        isLoading={isLoading}
        isDisabled={isDisabled}
        requestCount={requestCount}
        maxRequests={maxRequests}
      />
    </div>
  );
};