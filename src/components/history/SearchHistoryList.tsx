import { useState } from "react";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { SearchHistoryTable } from "./SearchHistoryTable";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

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
  const [minViews, setMinViews] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [minComments, setMinComments] = useState("");
  const [postsNewerThan, setPostsNewerThan] = useState("");

  if (searchHistory?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No search history found
      </div>
    );
  }

  const filteredHistory = searchHistory.map(item => ({
    ...item,
    search_results: item.search_results?.map(sr => ({
      ...sr,
      results: sr.results.filter(result => {
        const viewCount = Number(result.viewsCount) || 0;
        const likeCount = Number(result.likesCount) || 0;
        const commentCount = Number(result.commentsCount) || 0;
        const postDate = new Date(result.date);
        
        if (minViews && viewCount < Number(minViews)) return false;
        if (minLikes && likeCount < Number(minLikes)) return false;
        if (minComments && commentCount < Number(minComments)) return false;
        if (postsNewerThan && postDate < new Date(postsNewerThan.split('.').reverse().join('-'))) return false;
        
        return true;
      })
    }))
  }));

  const totalResults = searchHistory.reduce((acc, item) => 
    acc + (item.search_results?.[0]?.results?.length || 0), 0
  );

  const filteredResults = filteredHistory.reduce((acc, item) => 
    acc + (item.search_results?.[0]?.results?.length || 0), 0
  );

  const handleReset = () => {
    setMinViews("");
    setMinLikes("");
    setMinComments("");
    setPostsNewerThan("");
  };

  const currentPosts = filteredHistory.flatMap(item => 
    item.search_results?.[0]?.results || []
  );

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
          <Table className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="space-y-4">
          {filteredHistory?.map((item) => (
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
          searchHistory={filteredHistory}
          onDelete={onDelete}
          isDeleting={isDeleting}
          filters={{
            minViews,
            minLikes,
            minComments,
            postsNewerThan,
          }}
          onFilterChange={(key, value) => {
            switch (key) {
              case 'minViews':
                setMinViews(value);
                break;
              case 'minLikes':
                setMinLikes(value);
                break;
              case 'minComments':
                setMinComments(value);
                break;
              case 'postsNewerThan':
                setPostsNewerThan(value);
                break;
            }
          }}
          onReset={handleReset}
          totalResults={totalResults}
          filteredResults={filteredResults}
          currentPosts={currentPosts}
        />
      )}
    </div>
  );
}