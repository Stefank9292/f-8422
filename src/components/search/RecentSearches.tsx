import { X, Instagram, History } from "lucide-react";
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
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <div className="flex items-center gap-2.5">
        <History className="h-4.5 w-4.5 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground tracking-tight">Recent Searches</h3>
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
  );
};