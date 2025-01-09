import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InstagramPost } from "@/types/instagram";
import { SearchResults } from "./SearchResults";
import { SearchLoading } from "./SearchLoading";
import { SearchError } from "./SearchError";
import { SearchEmpty } from "./SearchEmpty";
import { transformSearchResults } from "@/utils/transformSearchResults";

interface SearchStateProps {
  searchHistoryId: string | null;
  error: Error | null;
  isSearching: boolean;
}

export const SearchState = ({ searchHistoryId, error, isSearching }: SearchStateProps) => {
  const { data: searchResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['search-results', searchHistoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_history_id', searchHistoryId)
        .single();
      
      if (error) throw error;
      
      // Transform the results using our utility function
      const transformedData = transformSearchResults(data);
      return transformedData.results;
    },
    enabled: !!searchHistoryId,
  });

  if (error) {
    return <SearchError error={error} />;
  }

  if (isSearching || isLoadingResults) {
    return <SearchLoading />;
  }

  if (!searchResults || searchResults.length === 0) {
    return <SearchEmpty />;
  }

  return <SearchResults searchResults={searchResults} />;
};