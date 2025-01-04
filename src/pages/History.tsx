import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InstagramPost } from "@/types/instagram";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { SearchHistorySelect } from "@/components/history/SearchHistorySelect";
import { SearchResultsGrid } from "@/components/history/SearchResultsGrid";

interface SearchHistoryItem {
  id: string;
  search_query: string;
  created_at: string;
}

interface SearchResultData {
  id: string;
  search_history_id: string;
  results: InstagramPost[];
  created_at: string;
}

export default function HistoryPage() {
  const [selectedSearchId, setSelectedSearchId] = useState<string>("");
  const { state } = useSidebar();

  const { data: searchHistory = [], isLoading: isHistoryLoading } = useQuery<SearchHistoryItem[]>({
    queryKey: ['search-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('id, search_query, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching search history:', error);
        throw error;
      }

      return data;
    },
    refetchInterval: 5000,
  });

  const { data: searchResult, isError, isLoading: isResultsLoading } = useQuery<SearchResultData | null>({
    queryKey: ['search-result', selectedSearchId],
    queryFn: async () => {
      if (!selectedSearchId) return null;

      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_history_id', selectedSearchId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching search result:', error);
        throw error;
      }

      if (!data) return null;

      const transformedResults = {
        ...data,
        results: Array.isArray(data.results) ? data.results.map((post: any) => ({
          ownerUsername: post.ownerUsername || '',
          caption: post.caption || '',
          date: post.date || '',
          playsCount: post.playsCount || 0,
          viewsCount: post.viewsCount || 0,
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          duration: post.duration || '',
          engagement: post.engagement || '',
          url: post.url || '',
          videoUrl: post.videoUrl,
          timestamp: post.timestamp || '',
        })) : [],
      };

      return transformedResults;
    },
    enabled: !!selectedSearchId,
    refetchInterval: 5000,
  });

  return (
    <div className={cn(
      "container mx-auto py-8 space-y-8",
      state === 'collapsed' ? "pl-16" : "pl-6"
    )}>
      <div className="space-y-4">
        <HistoryHeader />
        <SearchHistorySelect
          searchHistory={searchHistory}
          selectedSearchId={selectedSearchId}
          onSearchSelect={setSelectedSearchId}
          isLoading={isHistoryLoading}
        />
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load search results. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {selectedSearchId && !searchResult && !isError && !isResultsLoading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No results found for this search.
          </AlertDescription>
        </Alert>
      )}

      {isResultsLoading && selectedSearchId && (
        <div className="text-sm text-muted-foreground">Loading search results...</div>
      )}

      {searchResult && searchResult.results && (
        <SearchResultsGrid results={searchResult.results} />
      )}
    </div>
  );
}