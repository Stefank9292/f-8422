import { Search, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar = ({ username, onUsernameChange, onSearch }: SearchBarProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Enter Instagram username or profile URL"
        className="pl-10 pr-32"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Button
        variant="ghost"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-600"
      >
        <List className="w-4 h-4" />
        <span>Bulk Search</span>
      </Button>
    </div>
  );
};