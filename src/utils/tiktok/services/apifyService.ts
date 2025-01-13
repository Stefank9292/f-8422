import { supabase } from "@/integrations/supabase/client";
import { ApifyClient } from 'apify-client';
import { TikTokPost, TikTokApifyRequestBody } from '../types/TikTokTypes';

let apifyClient: ApifyClient | null = null;

async function getApifyClient() {
  if (!apifyClient) {
    const { data: { key }, error } = await supabase.functions.invoke('get-apify-key', {
      body: { type: 'tiktok' }
    });
    
    if (error) {
      console.error('Error fetching TikTok Apify key:', error);
      throw new Error('Failed to initialize TikTok API client');
    }
    
    apifyClient = new ApifyClient({
      token: key,
    });
  }
  return apifyClient;
}

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

    const client = await getApifyClient();
    
    const requestBody: TikTokApifyRequestBody = {
      username: username.replace('@', ''),
      maxPostCount: numberOfVideos,
      dateFilter: dateRange,
      region: location,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      }
    };
    
    // Run the TikTok scraper actor
    const run = await client.actor("clockworks/tiktok-profile-scraper").call(requestBody);

    // Fetch and process the results
    const { items: posts } = await client.dataset(run.defaultDatasetId).listItems();
    
    console.log('Received TikTok results:', posts);
    
    return posts.map((post: any) => ({
      id: post.id,
      shortcode: post.webVideoUrl,
      caption: post.description,
      timestamp: post.createTime,
      date: new Date(post.createTime).toISOString(),
      dimensions: {
        height: post.videoMeta?.height || 0,
        width: post.videoMeta?.width || 0
      },
      displayUrl: post.videoUrl,
      videoUrl: post.videoUrl,
      playsCount: post.playCount || 0,
      viewsCount: post.playCount || 0,
      likesCount: post.diggCount || 0,
      commentsCount: post.commentCount || 0,
      sharesCount: post.shareCount || 0,
      ownerUsername: username.replace('@', ''),
      engagement: ((post.diggCount || 0) + (post.commentCount || 0) + (post.shareCount || 0)) / (post.playCount || 1) * 100,
    }));

  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    throw error;
  }
}