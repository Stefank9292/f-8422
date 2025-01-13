import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InstagramPost } from "@/types/instagram";
import { transformSearchResults } from "@/utils/transformSearchResults";

interface SearchHistoryResult {
  id: string;
  search_query: string;
  created_at: string;
  search_results?: Array<{ results: InstagramPost[] }>;
  bulk_search_urls?: string[];
}

export const useSearchHistory = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      if (!userId) return null;

      const { data: historyData, error: historyError } = await supabase
        .from('search_history')
        .select(`
          id,
          search_query,
          created_at,
          bulk_search_urls,
          search_results (
            results
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (historyError) {
        console.error('Error fetching search history:', historyError);
        throw historyError;
      }

      return historyData?.map(item => ({
        id: item.id,
        search_query: item.search_query,
        created_at: item.created_at,
        bulk_search_urls: item.bulk_search_urls,
        search_results: item.search_results?.map(sr => ({
          results: transformSearchResults(sr as any).results
        }))
      })) as SearchHistoryResult[];
    },
    enabled: !!userId,
  });

  return { searchHistory, isLoading };
};