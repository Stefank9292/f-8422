import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchHistoryHeader } from "@/components/history/SearchHistoryHeader";
import { SearchHistoryList } from "@/components/history/SearchHistoryList";
import { InstagramPost } from "@/types/instagram";

interface SearchHistoryResult {
  id: string;
  search_query: string;
  created_at: string;
  search_results: Array<{
    results: Record<string, any>[];
  }>;
}

const SearchHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('search-history-changes')
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('search_history')
        .select(`
          *,
          search_results (
            results
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data as SearchHistoryResult[]).map(item => ({
        id: item.id,
        search_query: item.search_query,
        created_at: item.created_at,
        search_results: item.search_results?.map(sr => ({
          results: sr.results.map(result => ({
            ownerUsername: String(result.ownerUsername || ''),
            caption: String(result.caption || ''),
            date: String(result.date || ''),
            playsCount: Number(result.playsCount || 0),
            viewsCount: Number(result.viewsCount || 0),
            likesCount: Number(result.likesCount || 0),
            commentsCount: Number(result.commentsCount || 0),
            duration: String(result.duration || ''),
            engagement: String(result.engagement || ''),
            url: String(result.url || ''),
          } as InstagramPost))
        }))
      }));
    },
  });

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      toast({
        description: "Search history deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting search history:', error);
      toast({
        variant: "destructive",
        description: "Failed to delete search history",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeletingAll(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['search-history'] });
      toast({
        description: "All search history deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting all search history:', error);
      toast({
        variant: "destructive",
        description: "Failed to delete all search history",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <SearchHistoryHeader 
        onDeleteAll={handleDeleteAll}
        isDeletingAll={isDeletingAll}
        hasHistory={searchHistory && searchHistory.length > 0}
      />
      <SearchHistoryList 
        searchHistory={searchHistory || []}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SearchHistory;