import { supabase } from "@/integrations/supabase/client";

export interface TikTokPost {
  id: string;
  description: string;
  createTime: string;
  authorUsername: string;
  videoUrl: string;
  webVideoUrl: string;
  covers: string[];
  playCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  engagement: string;
}

export async function fetchTikTokPosts(
  username: string,
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<TikTokPost[]> {
  try {
    console.log('Fetching TikTok posts for:', username);
    
    const { data, error } = await supabase.functions.invoke('tiktok-scraper', {
      body: {
        username,
        numberOfVideos,
        postsNewerThan: postsNewerThan?.toISOString()
      }
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(error.message);
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid response from Edge Function:', data);
      throw new Error('Invalid response from TikTok scraper');
    }

    return data.map(post => ({
      id: post.id,
      description: post.description || '',
      createTime: new Date(post.createTime).toLocaleDateString(),
      authorUsername: post.authorUsername,
      videoUrl: post.videoUrl,
      webVideoUrl: post.webVideoUrl,
      covers: post.covers,
      playCount: post.playCount || 0,
      viewCount: post.viewCount || 0,
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      shareCount: post.shareCount || 0,
      engagement: `${((post.likeCount + post.commentCount + post.shareCount) / (post.playCount || 1) * 100).toFixed(2)}`
    }));
  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    throw error;
  }
}