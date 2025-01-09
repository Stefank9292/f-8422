import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { SearchHistoryFilter } from "./SearchHistoryFilter";
import { SearchHistoryLoading } from "./SearchHistoryLoading";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SearchHistoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: ['search-history', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
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

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
  
  const isProUser = subscriptionStatus?.priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || 
                   subscriptionStatus?.priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ";

  if (!isSteroidsUser && !isProUser) {
    return (
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
    );
  }

  if (isLoading) {
    return <SearchHistoryLoading />;
  }

  const filteredHistory = searchHistory?.filter(item =>
    searchQuery
      ? item.search_query.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || [];

  return (
    <div className="space-y-4">
      <SearchHistoryFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <SearchHistoryItem
            key={item.id}
            item={item}
            onDelete={async () => {
              await supabase
                .from('search_history')
                .delete()
                .eq('id', item.id);
            }}
            isDeleting={false}
          />
        ))}
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No search history found
          </div>
        )}
      </div>
    </div>
  );
}