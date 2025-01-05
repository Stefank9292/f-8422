import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface RecentSearchesProps {
  onSelect: (username: string) => void;
}

export const RecentSearches = ({ onSelect }: RecentSearchesProps) => {
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
    <div className="w-full flex flex-wrap gap-2 mt-3">
      {recentSearches.map((search) => (
        <div
          key={search.id}
          className="group flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/50 
                   hover:bg-gray-200/80 dark:hover:bg-gray-700/50 
                   px-3 py-1.5 rounded-full transition-colors"
        >
          <button
            onClick={() => onSelect(search.search_query)}
            className="text-[11px] text-gray-600 dark:text-gray-300 font-medium"
          >
            {search.search_query}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemove(search.id)}
          >
            <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            <span className="sr-only">Remove search</span>
          </Button>
        </div>
      ))}
    </div>
  );
};