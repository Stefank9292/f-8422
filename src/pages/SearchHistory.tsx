import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchHistoryList } from "@/components/history/SearchHistoryList";
import { SearchHistoryHeader } from "@/components/history/SearchHistoryHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchHistoryResult {
  id: string;
  search_query: string;
  created_at: string;
  search_results?: Array<{ results: any[] }>;
}

const SearchHistory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
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
          results: sr.results
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

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                        subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
  const isProUser = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
                    subscriptionStatus?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";

  // Show locked state for free users
  if (!isSteroidsUser && !isProUser) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Search History Locked</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Search history is only available on the{' '}
              <span className="instagram-gradient bg-clip-text text-transparent font-semibold animate-synchronized-pulse">
                Pro
              </span>{' '}
              plan and above. Upgrade your subscription to access this feature.
            </p>
            <Button 
              variant="secondary"
              className="mt-4 bg-[#221F26] text-white hover:bg-[#403E43]"
              onClick={() => navigate('/subscribe')}
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
      <SearchHistoryHeader 
        onDeleteAll={handleDeleteAll}
        isDeletingAll={isDeletingAll}
        hasHistory={searchHistory?.length > 0}
        isSteroidsUser={isSteroidsUser}
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