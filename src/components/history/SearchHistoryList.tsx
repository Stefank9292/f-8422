import { SearchHistoryItem } from "./SearchHistoryItem";

interface SearchHistoryListProps {
  searchHistory: Array<{
    id: string;
    search_query: string;
    created_at: string;
    search_results?: Array<{ results: any[] }>;
  }>;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function SearchHistoryList({ searchHistory, onDelete, isDeleting }: SearchHistoryListProps) {
  if (searchHistory?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No search history found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchHistory?.map((item) => (
        <SearchHistoryItem
          key={item.id}
          item={item}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}