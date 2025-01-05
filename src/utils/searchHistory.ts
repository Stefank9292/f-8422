import { supabase } from "@/integrations/supabase/client";
import { InstagramPost } from "@/types/instagram";
import { Json } from "@/integrations/supabase/types";

export async function saveSearchHistory(username: string, results: InstagramPost[]) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error('No authenticated user found');
      return null;
    }

    // Filter out invalid results before saving
    const validResults = results.filter(post => 
      post && 
      post.playsCount > 0 && 
      post.viewsCount > 0
    );

    // Only save if we have valid results
    if (validResults.length > 0) {
      // First create the search history entry
      const { data: searchHistory, error: searchError } = await supabase
        .from('search_history')
        .insert({
          search_query: username,
          search_type: 'instagram_search',
          user_id: session.user.id
        })
        .select()
        .single();

      if (searchError) {
        console.error('Error saving search history:', searchError);
        throw searchError;
      }

      // Convert InstagramPost[] to a format that matches the Json type
      const serializedResults = validResults.map(post => ({
        ...post,
        // Ensure all properties are serializable
        date: post.date?.toString() || '',
        timestamp: post.timestamp?.toString() || '',
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
        mentions: Array.isArray(post.mentions) ? post.mentions : [],
      }));

      // Then save the search results
      const { error: resultsError } = await supabase
        .from('search_results')
        .insert({
          search_history_id: searchHistory.id,
          results: serializedResults as unknown as Json
        });

      if (resultsError) {
        console.error('Error saving search results:', resultsError);
        throw resultsError;
      }

      return searchHistory;
    }

    return null;
  } catch (error) {
    console.error('Error storing search results:', error);
    throw error;
  }
}