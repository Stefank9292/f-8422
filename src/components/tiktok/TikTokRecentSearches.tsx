import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { RecentSearchHeader } from "./recent-searches/RecentSearchHeader";
import { RecentSearchList } from "./recent-searches/RecentSearchList";
import { useRecentSearches } from "./recent-searches/hooks/useRecentSearches";

interface TikTokRecentSearchesProps {
  onSelect: (username: string) => void;
}

export const TikTokRecentSearches = ({ onSelect }: TikTokRecentSearchesProps) => {
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

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";

  const {
    isCollapsed,
    setIsCollapsed,
    visibleSearches,
    handleRemove,
  } = useRecentSearches(session?.user?.id, isSteroidsUser);

  if (!isSteroidsUser) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 mt-6">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-medium">Recent Searches Locked</span>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          Recent searches are only available on the{' '}
          <Link 
            to="/subscribe" 
            className="instagram-gradient bg-clip-text text-transparent font-semibold animate-synchronized-pulse hover:opacity-80 transition-opacity"
          >
            Creator on Steroids
          </Link>{' '}
          plan
        </p>
      </div>
    );
  }

  if (visibleSearches.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <RecentSearchHeader 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div className={cn(
        "w-full grid place-items-center transition-all duration-300 ease-in-out",
        isCollapsed ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[500px] opacity-100"
      )}>
        <RecentSearchList
          searches={visibleSearches}
          onSelect={onSelect}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
};