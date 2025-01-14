import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TikTokSearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  isLoading?: boolean;
  onSearch: () => void;
}

export const TikTokSearchBar = ({ 
  username, 
  onUsernameChange,
  isLoading = false,
  onSearch
}: TikTokSearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && username.trim()) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Enter TikTok username or profile URL..."
          className="pl-12 h-12 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                     shadow-sm hover:shadow-md transition-all duration-300 ease-spring
                     placeholder:text-gray-400 dark:placeholder:text-gray-600 
                     bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      
      <Button
        onClick={onSearch}
        disabled={isLoading || !username.trim()}
        className="w-full h-11 !bg-[#000000e6] hover:!bg-black/90 rounded-xl shadow-sm 
                   hover:shadow-md transition-all duration-300 ease-spring text-white
                   disabled:!bg-black/50 disabled:hover:!bg-black/50"
        variant="default"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            <span className="text-[13px] font-medium">Searching...</span>
          </>
        ) : (
          <>
            <Search className="mr-2 h-3.5 w-3.5" />
            <span className="text-[13px] font-medium">Search Profile</span>
          </>
        )}
      </Button>
    </div>
  );
};