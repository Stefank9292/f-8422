import { TikTokPost } from "../types/TikTokTypes";
import { InstagramPost } from "@/types/instagram";

export function transformTikTokPost(post: TikTokPost): InstagramPost {
  return {
    ...post,
    url: post.url || `https://www.tiktok.com/@${post.ownerUsername}/video/${post.id}`,
    duration: post.duration || "0:00", // Default duration if not provided
    type: "video",
    timestamp: post.timestamp,
    hashtags: [],
    mentions: [],
    ownerId: post.ownerUsername, // Using username as ID since TikTok doesn't provide ID
    engagement: `${post.engagement}%`,
    locationName: undefined
  };
}

export function transformTikTokPosts(posts: TikTokPost[]): InstagramPost[] {
  return posts.map(transformTikTokPost);
}