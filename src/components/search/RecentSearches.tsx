import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecentSearchesProps {
  onSearchSelect: (username: string) => void;
}

export const RecentSearches = ({ onSearchSelect }: RecentSearchesProps) => {
  const { toast } = useToast();

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('search_history')
        .select('search_query, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent searches:', error);
        toast({
          title: "Error",
          description: "Failed to load recent searches",
          variant: "destructive",
        });
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
    staleTime: 0, // This ensures we always get fresh data
  });

  if (!recentSearches || recentSearches.length === 0) return null;

  const handleSearchSelect = (username: string) => {
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