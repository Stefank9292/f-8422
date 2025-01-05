import { useState } from "react";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { SearchHistoryTable } from "./SearchHistoryTable";
import { Button } from "@/components/ui/button";
import { TableCells, LayoutGrid } from "lucide-react";

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (searchHistory?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No search history found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="h-8 w-8 p-0"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'table' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('table')}
          className="h-8 w-8 p-0"
        >
          <TableCells className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === 'grid' ? (
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
      ) : (
        <SearchHistoryTable
          searchHistory={searchHistory}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}