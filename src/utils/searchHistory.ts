import { supabase } from "@/integrations/supabase/client";

export async function saveSearchHistory(username: string, results: any[]) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error('No authenticated user found');
      return null;
    }

    const { data: searchHistory, error: searchError } = await supabase
      .from('search_history')
      .insert({
        search_query: username,
        search_type: 'single',
        user_id: session.user.id
      })
      .select()
      .single();

    if (searchError) {
      console.error('Error saving search history:', searchError);
      throw searchError;
    }

    if (results && results.length > 0) {
      const { error: resultsError } = await supabase
        .from('search_results')
        .insert({
          search_history_id: searchHistory.id,
          results: JSON.parse(JSON.stringify(results))
        });

      if (resultsError) {
        console.error('Error saving search results:', resultsError);
        throw resultsError;
      }
    }

    return searchHistory;
  } catch (error) {
    console.error('Error storing search results:', error);
    throw error;
  }
}