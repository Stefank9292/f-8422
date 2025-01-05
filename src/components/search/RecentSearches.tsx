import { X, Instagram, History } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface RecentSearchesProps {
  onSelect: (username: string) => void;
}

export const RecentSearches = ({ onSelect }: RecentSearchesProps) => {
  const queryClient = useQueryClient();

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return [];

      const { data } = await supabase
        .from('search_history')
        .select('id, search_query')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return data || [];
    },
  });

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

  const handleRemove = async (id: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user?.id) return;

    await supabase
      .from('search_history')
      .delete()
      .eq('id', id)
      .eq('user_id', session.session.user.id);
  };

  if (recentSearches.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <History className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground font-medium">Recent Searches</span>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-2.5">
        {recentSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
            <button
              onClick={() => onSelect(search.search_query)}
              className="text-[11px] font-medium text-gray-800 dark:text-gray-200"
            >
              {search.search_query}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-2 w-2 p-0 hover:bg-transparent"
              onClick={() => handleRemove(search.id)}
            >
              <X className="h-2 w-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              <span className="sr-only">Remove search</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};