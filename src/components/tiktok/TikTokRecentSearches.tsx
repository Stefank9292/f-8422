import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TikTokRecentSearchesProps {
  onSelect: (username: string) => void;
}

export function TikTokRecentSearches({ onSelect }: TikTokRecentSearchesProps) {
  const { data: recentSearches = [] } = useQuery({
    queryKey: ['tiktok-recent-searches'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('tiktok_search_history')
        .select('id, search_query, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (recentSearches.length === 0) return null;

  return (
    <div className="w-full flex flex-wrap justify-center gap-2 animate-in fade-in duration-300">
      {recentSearches.map((search) => (
        <div
          key={search.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm
                   hover:shadow-md transition-all duration-200"
        >
          <History className="w-3.5 h-3.5 text-[#FF0050]" />
          <button
            onClick={() => onSelect(search.search_query)}
            className="text-[11px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#FF0050] transition-colors"
          >
            {search.search_query}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            <span className="sr-only">Remove search</span>
          </Button>
        </div>
      ))}
    </div>
  );
}