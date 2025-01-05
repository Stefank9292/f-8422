import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchHistoryListProps {
  searchHistory: Array<{
    id: string;
    search_query: string;
    created_at: string;
    search_results?: Array<{ results: any[] }>;
  }>;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function SearchHistoryList({ searchHistory, onDelete, isDeleting }: SearchHistoryListProps) {
  const navigate = useNavigate();
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
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                        subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";

  if (!isSteroidsUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Lock className="w-12 h-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Search History Locked</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Search history is only available on the{' '}
            <span className="instagram-gradient bg-clip-text text-transparent font-semibold animate-synchronized-pulse">
              Creator on Steroids
            </span>{' '}
            plan. Upgrade your subscription to access this feature.
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
    );
  }

  if (searchHistory?.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No search history found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchHistory?.map((item) => (
        <SearchHistoryItem
          key={item.id}
          item={item}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}