import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { SearchHistoryHeader } from "@/components/history/SearchHistoryHeader";
import { SearchHistoryList } from "@/components/history/SearchHistoryList";
import { Input } from "@/components/ui/input";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchHistoryActions } from "@/hooks/useSearchHistoryActions";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";

const SearchHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Use custom hooks
  const { searchHistory, isLoading } = useSearchHistory(session?.user?.id);
  const { data: subscriptionStatus } = useSubscriptionCheck(session);
  const { isDeleting, isDeletingAll, handleDelete, handleDeleteAll } = 
    useSearchHistoryActions(session?.user?.id);

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9";

  const filteredHistory = searchHistory?.filter(item =>
    isSteroidsUser && searchQuery
      ? item.search_query.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
      <SearchHistoryHeader 
        onDeleteAll={handleDeleteAll}
        isDeletingAll={isDeletingAll}
        hasHistory={searchHistory && searchHistory.length > 0}
        isSteroidsUser={isSteroidsUser}
        totalSearches={searchHistory?.length || 0}
      />
      
      {searchHistory && searchHistory.length > 0 && isSteroidsUser && (
        <div className="relative w-full max-w-md mx-auto mb-6">
          <Input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      )}
      
      <SearchHistoryList 
        searchHistory={filteredHistory || []}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SearchHistory;