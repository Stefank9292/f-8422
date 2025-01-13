import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { History, ChevronDown, ChevronUp, X } from "lucide-react";

interface TikTokRecentSearchesProps {
  onSelect: (username: string) => void;
}

export const TikTokRecentSearches = ({ onSelect }: TikTokRecentSearchesProps) => {
  const [hiddenSearches, setHiddenSearches] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('tiktokRecentSearchesCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const queryClient = useQueryClient();

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

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['tiktok-recent-searches'],
    queryFn: async () => {
      if (!isSteroidsUser) return [];
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('tiktok_search_history')
        .select('id, search_query')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent TikTok searches:', error);
        throw error;
      }

      return data || [];
    },
    enabled: isSteroidsUser,
  });

  const handleRemove = (id: string) => {
    setHiddenSearches(prev => [...prev, id]);
  };

  const visibleSearches = recentSearches.filter(search => !hiddenSearches.includes(search.id));

  if (!isSteroidsUser || visibleSearches.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
      >
        <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span className="font-medium">Recent TikTok Searches</span>
        {isCollapsed ? (
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        ) : (
          <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        )}
      </button>
      
      <div
        className={`w-full grid place-items-center transition-all duration-300 ease-in-out
          ${isCollapsed ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[500px] opacity-100"}`}
      >
        <div className="w-full flex flex-wrap justify-center gap-2.5">
          {visibleSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm"
            >
              <button
                onClick={() => onSelect(search.search_query)}
                className="text-[11px] font-medium text-gray-800 dark:text-gray-200"
              >
                {search.search_query}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(search.id)}
              >
                <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                <span className="sr-only">Remove search</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};