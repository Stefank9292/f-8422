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
  channel: {
    name: string;
    username: string;
    id: string;
    url: string;
    avatar: string;
    verified: boolean;
    followers: number;
    following: number;
    videos: number;
  };
  video: {
    url: string;
    cover: string;
  };
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
    console.log('Fetching TikTok posts for:', { username: cleanUsername, numberOfVideos, dateRange, location });

    const { data, error } = await supabase.functions.invoke('tiktok-apify-scraper', {
      body: {
        username: cleanUsername,
        numberOfVideos,
        dateRange,
        location
      }
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid response from Edge Function:', data);
      throw new Error('Invalid response from TikTok scraper');
    }

    return data.map(post => ({
      ...post,
      channel: {
        name: post["channel.name"]?.value || '',
        username: post["channel.username"]?.value || '',
        id: post["channel.id"]?.value || '',
        url: post["channel.url"]?.value || '',
        avatar: post["channel.avatar"]?.value || '',
        verified: post["channel.verified"]?.value || false,
        followers: post["channel.followers"]?.value || 0,
        following: post["channel.following"]?.value || 0,
        videos: post["channel.videos"]?.value || 0
      },
      video: {
        url: post["video.url"]?.value || '',
        cover: post["video.cover"]?.value || ''
      }
    }));
  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    throw error;
  }
}