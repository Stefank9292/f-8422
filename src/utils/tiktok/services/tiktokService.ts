import { supabase } from "@/integrations/supabase/client";
import type { DateRangeOption, LocationOption } from "@/components/tiktok/TikTokSearchSettings";

export interface TikTokPost {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  uploadedAt: number;
  uploadedAtFormatted: string;
  postPage: string;
  "channel.name": string;
  "channel.username": string;
  "channel.id": string;
  "channel.url": string;
  "channel.avatar": string;
  "channel.verified": boolean;
  "channel.followers": number;
  "channel.following": number;
  "channel.videos": number;
  "video.url": string;
  "video.cover": string;
  engagement: string;
}

export async function fetchTikTokPosts(
  username: string,
  numberOfVideos: number = 3,
  dateRange: DateRangeOption = "DEFAULT",
  location: LocationOption = "US"
): Promise<TikTokPost[]> {
  try {
    console.log('Fetching TikTok posts for:', { username, numberOfVideos, dateRange, location });
    
    // Clean up the username and ensure it's in the correct format
    const cleanUsername = username.replace('@', '').trim();
    const url = `https://www.tiktok.com/@${cleanUsername}`;

    const { data, error } = await supabase.functions.invoke('tiktok-apify-scraper', {
      body: {
        username: cleanUsername,
        startUrls: [url],
        maxItems: numberOfVideos,
        dateRange,
        location,
        customMapFunction: "(object) => { return {...object} }"
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
      title: post.title || '',
      views: post.views || 0,
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
      bookmarks: post.bookmarks || 0,
      uploadedAt: post.uploadedAt,
      uploadedAtFormatted: post.uploadedAtFormatted,
      postPage: post.postPage,
      "channel.name": post["channel.name"],
      "channel.username": post["channel.username"],
      "channel.id": post["channel.id"],
      "channel.url": post["channel.url"],
      "channel.avatar": post["channel.avatar"],
      "channel.verified": post["channel.verified"],
      "channel.followers": post["channel.followers"],
      "channel.following": post["channel.following"],
      "channel.videos": post["channel.videos"],
      "video.url": post["video.url"],
      "video.cover": post["video.cover"],
      engagement: `${((post.likes + post.comments + post.shares) / (post.views || 1) * 100).toFixed(2)}`
    }));
  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    throw error;
  }
}