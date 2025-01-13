import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchHistoryHeader } from "@/components/history/SearchHistoryHeader";
import { SearchHistoryList } from "@/components/history/SearchHistoryList";
import { InstagramPost } from "@/types/instagram";
import { Input } from "@/components/ui/input";
import { transformSearchResults } from "@/utils/transformSearchResults";

interface SearchHistoryResult {
  id: string;
  search_query: string;
  created_at: string;
  search_results?: Array<{ results: InstagramPost[] }>;
}

const SearchHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // First, get the session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  useEffect(() => {
    const channel = supabase
      .channel('search_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'search_history'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['search-history'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: historyData, error: historyError } = await supabase
        .from('search_history')
        .select(`
          id,
          search_query,
          created_at,
          search_results (
            results
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (historyError) {
        console.error('Error fetching search history:', historyError);
        throw historyError;
      }

      return historyData?.map(item => ({
        id: item.id,
        search_query: item.search_query,
        created_at: item.created_at,
        search_results: item.search_results?.map(sr => ({
          results: transformSearchResults(sr as any).results
        }))
      })) as SearchHistoryResult[];
    },
    enabled: !!session?.user?.id,
  });

  const handleDelete = async (id: string) => {
    if (!session?.user?.id) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      
      toast({
        title: "Success",
        description: "Search history item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting search history:', error);
      toast({
        title: "Error",
        description: "Failed to delete search history item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!session?.user?.id) return;

    try {
      setIsDeletingAll(true);
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      
      toast({
        title: "Success",
        description: "All search history deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting all search history:', error);
      toast({
        title: "Error",
        description: "Failed to delete all search history",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Update the isSteroidsUser check to use the correct price ID
  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9";

  const filteredHistory = searchHistory?.filter(item =>
    isSteroidsUser && searchQuery
      ? item.search_query.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
      <SearchHistoryHeader 
        onDeleteAll={handleDeleteAll}
        isDeletingAll={isDeletingAll}
        hasHistory={searchHistory && searchHistory.length > 0}
        isSteroidsUser={isSteroidsUser}
        totalSearches={searchHistory?.length || 0}
      />
      
      {searchHistory && searchHistory.length > 0 && isSteroidsUser && (
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
      )}
      
      <SearchHistoryList 
        searchHistory={filteredHistory || []}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SearchHistory;