import { supabase } from "@/integrations/supabase/client";

export interface TikTokVideo {
  authorUsername: string;
  description: string;
  createTime: string;
  playCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagement: string;
  webVideoUrl: string;
}

export const searchTikTokProfile = async (
  username: string,
  numberOfVideos: number = 5,
  dateFrom?: Date
): Promise<TikTokVideo[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('tiktok-apify-scraper', {
      body: {
        username,
        numberOfVideos,
        dateFrom: dateFrom?.toISOString(),
      },
    });

    if (error) {
      console.error('Error fetching TikTok data:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in TikTok service:', error);
    throw error;
  }
}