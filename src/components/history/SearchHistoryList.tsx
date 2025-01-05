import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { Lock } from "lucide-react";

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
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { subscriptionStatus } = useSubscriptionLimits(session);
  const isSteroidsUser = subscriptionStatus === 'ultra';

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