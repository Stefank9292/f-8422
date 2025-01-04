import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchHistorySelectProps {
  searchHistory: Array<{
    id: string;
    search_query: string;
    created_at: string;
  }>;
  selectedSearchId: string;
  onSearchSelect: (id: string) => void;
  isLoading: boolean;
}

export function SearchHistorySelect({
  searchHistory,
  selectedSearchId,
  onSearchSelect,
  isLoading
}: SearchHistorySelectProps) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading search history...</div>;
  }

  return (
    <Select value={selectedSearchId} onValueChange={onSearchSelect}>
      <SelectTrigger className={cn("w-full", !selectedSearchId && "text-muted-foreground")}>
        <SelectValue placeholder="Select a search to view results" />
      </SelectTrigger>
      <SelectContent>
        {searchHistory.map((search) => (
          <SelectItem key={search.id} value={search.id}>
            <div className="flex justify-between items-center gap-4">
              <span>@{search.search_query}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(search.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}