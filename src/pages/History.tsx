import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchResults } from "@/components/search/SearchResults";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const History = () => {
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);

  const { data: searchHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: searchResults, isLoading: isResultsLoading } = useQuery({
    queryKey: ['search-results', selectedHistory],
    queryFn: async () => {
      if (!selectedHistory) return null;

      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_history_id', selectedHistory)
        .single();

      if (error) throw error;
      return data.results;
    },
    enabled: !!selectedHistory,
  });

  return (
    <PageContainer>
      <PageHeader 
        title="Search History" 
        description="View your recent searches and results."
      />

      <div className="space-y-8">
        {isHistoryLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : searchHistory && searchHistory.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchHistory.map((history) => (
              <Button
                key={history.id}
                variant={selectedHistory === history.id ? "default" : "outline"}
                className="justify-start h-auto p-4 space-y-2"
                onClick={() => setSelectedHistory(history.id)}
              >
                <div className="w-full text-left">
                  <div className="font-medium">{history.search_query}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(history.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Type: {history.search_type}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No search history found
          </div>
        )}

        {selectedHistory && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Search Results</h2>
            {isResultsLoading ? (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : searchResults ? (
              <div className="rounded-xl border border-border overflow-hidden">
                <SearchResults posts={searchResults} filters={{}} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No results found for this search
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default History;