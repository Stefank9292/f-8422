import { supabase } from "@/integrations/supabase/client";
import { TikTokPost } from '../types/TikTokTypes';

export async function fetchTikTokPosts(
  username: string,
  numberOfVideos: number = 3,
  dateRange: string = 'DEFAULT',
  location: string = 'US'
): Promise<TikTokPost[]> {
  try {
    console.log('Starting TikTok search with params:', {
      username,
      numberOfVideos,
      dateRange,
      location
    });

    const { data, error } = await supabase.functions.invoke('tiktok-scraper', {
      body: { username, numberOfVideos, dateRange, location }
    });
    
    if (error) throw error;
    console.log('Received TikTok results:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    throw error;
  }
}