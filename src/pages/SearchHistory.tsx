import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchHistoryList } from "@/components/history/SearchHistoryList";
import { SearchHistoryHeader } from "@/components/history/SearchHistoryHeader";
import { SearchHistoryFilters } from "@/components/history/SearchHistoryFilters";
import { transformSearchResults } from "@/utils/transformSearchResults";

interface SearchHistoryResult {
  id: string;
  search_query: string;
  created_at: string;
  search_results?: Array<{ results: any[] }>;
}

const SearchHistory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
      <SearchHistoryList 
        searchHistory={searchHistory || []}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SearchHistory;