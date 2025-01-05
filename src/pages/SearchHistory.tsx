import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SearchHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

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
      return data;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Search History</h1>
        <p className="text-sm text-muted-foreground">
          Your last 10 searches are shown here
        </p>
      </div>

      <div className="space-y-4">
        {searchHistory?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No search history found
          </div>
        ) : (
          searchHistory?.map((item: any) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">@{item.search_query}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray(item.search_results?.[0]?.results) 
                      ? item.search_results[0]?.results.length 
                      : 0} results found
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/search?q=${item.search_query}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchHistory;