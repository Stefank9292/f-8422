import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { extractUsername } from "@/utils/instagram";
import { RecentSearchItem } from "./recent/RecentSearchItem";
import { RecentSearchesHeader } from "./recent/RecentSearchesHeader";

interface RecentSearchesProps {
  onSelect: (username: string) => void;
}

export const RecentSearches = ({ onSelect }: RecentSearchesProps) => {
  const [hiddenSearches, setHiddenSearches] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('recentSearchesCollapsed');
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

  // Set up real-time listener for search history changes
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
          queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('recentSearchesCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('search_history')
        .select('id, search_query, bulk_search_urls')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent searches:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleRemove = (id: string) => {
    setHiddenSearches(prev => [...prev, id]);
  };

  const visibleSearches = recentSearches.filter(search => !hiddenSearches.includes(search.id));

  if (visibleSearches.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <RecentSearchesHeader 
        isCollapsed={isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div className={`w-full grid place-items-center transition-all duration-300 ease-in-out
        ${isCollapsed ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[500px] opacity-100"}`}
      >
        <div className="w-full flex flex-wrap justify-center gap-2.5">
          {visibleSearches.map((search) => {
            const displayQuery = search.bulk_search_urls?.length 
              ? `${extractUsername(search.bulk_search_urls[0])}`
              : search.search_query;

            return (
              <RecentSearchItem
                key={search.id}
                id={search.id}
                searchQuery={displayQuery}
                bulkSearchUrls={search.bulk_search_urls}
                onSelect={onSelect}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};