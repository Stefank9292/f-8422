import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History, Instagram } from "lucide-react";
import { trackUserRequest } from "@/utils/requestTracker";

interface RecentSearchesProps {
  onSearchSelect: (username: string) => void;
}

export const RecentSearches = ({ onSearchSelect }: RecentSearchesProps) => {
  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      // Track the request before fetching recent searches
      await trackUserRequest();

      const { data, error } = await supabase
        .from('search_history')
        .select('search_query, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent searches:', error);
        throw error;
      }

      // Remove duplicates while preserving order
      const uniqueSearches = data.filter((search, index, self) =>
        index === self.findIndex((s) => s.search_query === search.search_query)
      );

      return uniqueSearches;
    },
  });

  if (!recentSearches || recentSearches.length === 0) return null;

  const handleSearchSelect = async (username: string) => {
    // Track the request when a recent search is selected
    await trackUserRequest();
    onSearchSelect(username);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <History className="w-4 h-4" />
        <span className="text-sm font-medium">Recent Searches</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => handleSearchSelect(search.search_query)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-sm">@{search.search_query}</span>
          </button>
        ))}
      </div>
    </div>
  );
};