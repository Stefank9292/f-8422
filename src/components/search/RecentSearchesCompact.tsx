import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History, Instagram } from "lucide-react";

interface RecentSearchesCompactProps {
  onSearchSelect: (username: string) => void;
}

export const RecentSearchesCompact = ({ onSearchSelect }: RecentSearchesCompactProps) => {
  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-searches-compact'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('search_history')
        .select('search_query, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent searches:', error);
        return [];
      }

      // Remove duplicates while preserving order
      const uniqueSearches = data.filter((search, index, self) =>
        index === self.findIndex((s) => s.search_query === search.search_query)
      );

      return uniqueSearches;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  if (!recentSearches || recentSearches.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <History className="w-3 h-3" />
        <span className="text-xs font-medium">Recent</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recentSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchSelect(search.search_query)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs bg-white/50 dark:bg-gray-800/50 rounded-full border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Instagram className="w-3 h-3" />
            <span>@{search.search_query}</span>
          </button>
        ))}
      </div>
    </div>
  );
};