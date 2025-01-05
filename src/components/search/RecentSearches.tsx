import { X, Instagram } from "lucide-react";
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
    <div className="w-full flex flex-col items-center space-y-3 mt-4">
      <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
      <div className="w-full flex flex-wrap justify-center gap-2">
        {recentSearches.map((search) => (
          <div
            key={search.id}
            className="group flex items-center gap-2 bg-secondary/50 hover:bg-secondary/80 
                     px-4 py-2 rounded-full transition-all duration-200 
                     border border-border/50 hover:border-border/80"
          >
            <Instagram className="h-3.5 w-3.5 text-muted-foreground" />
            <button
              onClick={() => onSelect(search.search_query)}
              className="text-xs text-foreground/80 hover:text-foreground font-medium"
            >
              {search.search_query}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(search.id)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove search</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};