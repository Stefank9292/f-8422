import { supabase } from "@/integrations/supabase/client";

interface TikTokPost {
  url: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  playsCount: number;
  duration: string;
  engagement: string;
  date: string;
  type: string;
  timestamp: string;
  hashtags: string[];
  mentions: string[];
  ownerUsername: string;
  ownerId: string;
  videoUrl?: string;
}

export const fetchTikTokPosts = async (
  url: string,
  maxPosts: number = 3,
  selectedDate?: Date
): Promise<TikTokPost[]> => {
  try {
    const { data: { data: posts }, error } = await supabase.functions.invoke('tiktok-scraper', {
      body: {
        directUrls: [url],
        maxPosts,
        onlyPostsNewerThan: selectedDate?.toISOString(),
      },
    });

    if (error) throw error;

    return posts.map((post: any) => ({
      url: post.url || '',
      caption: post.caption || '',
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      viewsCount: post.viewsCount || 0,
      playsCount: post.playsCount || 0,
      duration: post.duration || '0:00',
      engagement: `${((post.likesCount + post.commentsCount) / (post.viewsCount || 1) * 100).toFixed(2)}%`,
      date: new Date(post.timestamp).toLocaleDateString(),
      type: 'TikTok',
      timestamp: post.timestamp,
      hashtags: post.hashtags || [],
      mentions: post.mentions || [],
      ownerUsername: post.ownerUsername || '',
      ownerId: post.ownerId || '',
      videoUrl: post.videoUrl
    }));
  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    throw error;
  }
};