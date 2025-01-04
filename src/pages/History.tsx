import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, History, Instagram, Loader2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SearchResults } from "@/components/search/SearchResults";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/searchStore";

export default function HistoryPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSearchId, setSelectedSearchId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUsername } = useSearchStore();

  const { data: recentSearches = [], isLoading: isLoadingSearches } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching recent searches",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const { data: searchResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['search-results', selectedSearchId],
    queryFn: async () => {
      if (!selectedSearchId) return null;

      const { data, error } = await supabase
        .from('search_results')
        .select('results')
        .eq('search_history_id', selectedSearchId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching search results",
          description: error.message,
        });
        throw error;
      }

      return data.results;
    },
    enabled: !!selectedSearchId
  });

  const filteredSearches = recentSearches.filter(search => 
    search.search_query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSearchSelect = (search: any) => {
    setSelectedSearchId(search.id);
  };

  const handleNewSearch = (username: string) => {
    setUsername(username);
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
        <History className="w-6 h-6" />
        <h1>Recent Searches</h1>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter searches..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

      {isLoadingSearches ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSearches.length > 0 ? (
        <div className="grid gap-4">
          {filteredSearches.map((search) => (
            <button
              key={search.id}
              onClick={() => handleSearchSelect(search)}
              className={cn(
                "flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-lg border border-border transition-colors group",
                selectedSearchId === search.id && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <span className="font-medium">@{search.search_query}</span>
                  <p className="text-sm text-muted-foreground">
                    {search.search_type === 'bulk' ? 'Bulk Search' : 'Single Search'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {formatDate(search.created_at)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewSearch(search.search_query);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {searchFilter ? "No matching searches found" : "No recent searches"}
        </div>
      )}

      {selectedSearchId && searchResults && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {isLoadingResults ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="material-card overflow-hidden animate-in fade-in duration-300">
              <SearchResults posts={searchResults} filters={{
                postsNewerThan: '',
                minViews: '',
                minPlays: '',
                minLikes: '',
                minComments: '',
                minDuration: '',
                minEngagement: ''
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}