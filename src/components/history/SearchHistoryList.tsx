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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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

  return (
    <div className="space-y-4">
      {filteredHistory?.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium truncate">@{item.search_query}</span>
                <span className="text-xs text-muted-foreground">
                  ({item.search_results?.[0]?.results?.length || 0} results)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={expandedItem === item.id && viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setExpandedItem(expandedItem === item.id ? null : item.id);
                    setViewMode('grid');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={expandedItem === item.id && viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setExpandedItem(expandedItem === item.id ? null : item.id);
                    setViewMode('table');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Table className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Delete</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-destructive"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          
          {expandedItem === item.id && (
            <div className="pl-2 animate-fade-in">
              {viewMode === 'grid' ? (
                <div className="space-y-2">
                  {item.search_results?.[0]?.results.map((result, index) => (
                    <SearchHistoryItem
                      key={index}
                      item={{
                        id: item.id,
                        search_query: item.search_query,
                        created_at: item.created_at,
                        search_results: [{ results: [result] }]
                      }}
                      onDelete={onDelete}
                      isDeleting={isDeleting}
                    />
                  ))}
                </div>
              ) : (
                <SearchHistoryTable
                  searchHistory={[item]}
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
                  currentPosts={item.search_results?.[0]?.results || []}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}