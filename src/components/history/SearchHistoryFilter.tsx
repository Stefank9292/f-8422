import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchHistoryFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchHistoryFilter = ({ searchQuery, setSearchQuery }: SearchHistoryFilterProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <Input
        type="text"
        placeholder="Search by username..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 h-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
};