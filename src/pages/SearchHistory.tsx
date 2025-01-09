import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchHistoryList } from "@/components/history/SearchHistoryList";
import { SearchHistoryHeader } from "@/components/history/SearchHistoryHeader";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: ['search-history', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select(`
          *,
          search_results (
            results
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
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

  const handleClearHistory = async () => {
    if (!session?.user.id) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
  
  const isProUser = subscriptionStatus?.priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || 
                   subscriptionStatus?.priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ";

  if (!isSteroidsUser && !isProUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Search History Locked</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Upgrade to Creator Pro or Creator on Steroids to access your search history and more features.
          </p>
          <Button 
            onClick={() => navigate('/subscribe')}
            className="bg-[#1a365d] hover:bg-[#1a365d]/90 text-white"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  const filteredHistory = searchHistory?.filter(item =>
    isSteroidsUser && searchQuery
      ? item.search_query.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHistoryHeader
        totalSearches={filteredHistory.length}
        onClearHistory={handleClearHistory}
        isLoading={isLoading}
      />
      <SearchHistoryList />
    </div>
  );
};

export default SearchHistory;