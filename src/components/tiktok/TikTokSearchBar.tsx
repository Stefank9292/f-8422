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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-full">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Enter TikTok username..."
          className="pl-12 h-12 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                     shadow-sm hover:shadow-md transition-all duration-200
                     placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || !username.trim()}
        className="w-full h-10 bg-black hover:bg-black/90 rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <Search className="mr-2 h-3.5 w-3.5" />
            Search Profile
          </>
        )}
      </Button>
    </form>
  );
};