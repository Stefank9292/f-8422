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

const formatTikTokUsername = (input: string): string => {
  // Remove any trailing slashes
  input = input.replace(/\/$/, '');
  
  // If it's already a full URL, extract just the username
  if (input.includes('tiktok.com/')) {
    const match = input.match(/@([^/?]+)/);
    return match ? match[1] : input.split('@').pop()!;
  }
  
  // If it's just a username, remove @ if present
  return input.replace('@', '');
};

export async function fetchTikTokPosts(
  username: string,
  numberOfVideos: number = 3,
  dateRange: DateRangeOption = "DEFAULT",
  location: LocationOption = "US"
): Promise<TikTokPost[]> {
  try {
    const cleanUsername = formatTikTokUsername(username);
    const url = `https://www.tiktok.com/@${cleanUsername}`;
    
    console.log('Fetching TikTok posts for:', { username: cleanUsername, numberOfVideos, dateRange, location });

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