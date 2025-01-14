import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRecentSearches = (userId: string | undefined, isSteroidsUser: boolean) => {
  const [hiddenSearches, setHiddenSearches] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('tiktokRecentSearchesCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem('tiktokRecentSearchesCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (!isSteroidsUser || !userId) return;

    const channel = supabase
      .channel('tiktok-search-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tiktok_search_history',
          filter: `user_id=eq.${userId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['recent-tiktok-searches'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, isSteroidsUser, userId]);

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-tiktok-searches'],
    queryFn: async () => {
      if (!isSteroidsUser || !userId) return [];
      
      const { data, error } = await supabase
        .from('tiktok_search_history')
        .select('id, search_query')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: isSteroidsUser && !!userId,
  });

  const handleRemove = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tiktok_search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      
      setHiddenSearches(prev => [...prev, id]);
      queryClient.invalidateQueries({ queryKey: ['recent-tiktok-searches'] });
    } catch (error) {
      console.error('Error removing search:', error);
    }
  };

  const visibleSearches = recentSearches
    .filter(search => !hiddenSearches.includes(search.id))
    .slice(0, 5);

  return {
    isCollapsed,
    setIsCollapsed,
    visibleSearches,
    handleRemove,
  };
};