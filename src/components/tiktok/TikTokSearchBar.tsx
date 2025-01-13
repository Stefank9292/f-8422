import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TikTokSearchBarProps {
  username: string;
  onSearch: () => void;
  isLoading: boolean;
  onUsernameChange: (username: string) => void;
}

export function TikTokSearchBar({
  username,
  onSearch,
  isLoading,
  onUsernameChange,
}: TikTokSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && username.trim()) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Enter TikTok username..."
        className="pl-12 h-10 text-[13px] rounded-xl border border-gray-200/80 dark:border-gray-800/80 
                 focus:border-[#FF0050] shadow-sm
                 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>
  );
}