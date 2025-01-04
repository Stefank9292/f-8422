import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History } from "lucide-react";

interface RecentSearchesProps {
  onSearchSelect: (username: string) => void;
}

export const RecentSearches = ({ onSearchSelect }: RecentSearchesProps) => {
  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('search_query')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Remove duplicates while preserving order
      const uniqueSearches = data.filter((search, index, self) =>
        index === self.findIndex((s) => s.search_query === search.search_query)
      );

      return uniqueSearches;
    },
  });

  if (recentSearches.length === 0) return null;

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
            onClick={() => onSearchSelect(search.search_query)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <img 
              src="/lovable-uploads/8a8b904b-ed3c-4561-8289-a9ddd563e8e6.png" 
              alt="Instagram" 
              className="w-4 h-4"
            />
            <span className="text-sm">@{search.search_query}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
