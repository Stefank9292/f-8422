import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { SearchHistoryFilter } from "./SearchHistoryFilter";
import { useState } from "react";

interface SearchHistoryContentProps {
  userId: string;
}

export function SearchHistoryContent({ userId }: SearchHistoryContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: ['search-history', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const filteredHistory = searchHistory?.filter(item =>
    searchQuery
      ? item.search_query.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || [];

  return (
    <div className="space-y-4">
      <SearchHistoryFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <SearchHistoryItem
            key={item.id}
            item={item}
            onDelete={async () => {
              await supabase
                .from('search_history')
                .delete()
                .eq('id', item.id);
            }}
            isDeleting={false}
          />
        ))}
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No search history found
          </div>
        )}
      </div>
    </div>
  );
}