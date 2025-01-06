import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchHistoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isEnabled: boolean;
}

export function SearchHistoryFilters({ searchQuery, onSearchChange, isEnabled }: SearchHistoryFiltersProps) {
  if (!isEnabled) return null;

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <Input
        type="text"
        placeholder="Search by username..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}