import { InstagramPost } from "@/types/instagram";
import { parse, isAfter } from "date-fns";

export interface FilterState {
  postsNewerThan: string;
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
  minShares: string;
}

const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  return parseInt(value.replace(/\./g, '').replace(',', '.'));
};

const parseEngagement = (engagement: string): number => {
  return parseFloat(engagement.replace('%', ''));
};

export const filterResults = (posts: InstagramPost[], filters: FilterState, platform: 'instagram' | 'tiktok' = 'instagram') => {
  if (!posts || !Array.isArray(posts)) {
    console.warn('No posts provided to filter');
    return [];
  }

  return posts.filter(post => {
    // Filter by date
    if (filters.postsNewerThan) {
      try {
        const filterDate = parse(filters.postsNewerThan, 'dd.MM.yyyy', new Date());
        const postDate = new Date(post.timestamp || post.date);
        
        if (!isAfter(postDate, filterDate)) {
          return false;
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }

    if (platform === 'instagram') {
      // Instagram-specific filters
      if (filters.minViews) {
        const minViews = parseFormattedNumber(filters.minViews);
        if (post.viewsCount < minViews) return false;
      }

      if (filters.minPlays) {
        const minPlays = parseFormattedNumber(filters.minPlays);
        if (post.playsCount < minPlays) return false;
      }
    } else {
      // TikTok-specific filters
      if (filters.minViews) {
        const minViews = parseFormattedNumber(filters.minViews);
        if (post.viewsCount < minViews) return false;
      }

      if (filters.minShares && post.sharesCount !== undefined) {
        const minShares = parseFormattedNumber(filters.minShares);
        if (post.sharesCount < minShares) return false;
      }
    }

    // Common filters for both platforms
    if (filters.minLikes) {
      const minLikes = parseFormattedNumber(filters.minLikes);
      if (post.likesCount < minLikes) return false;
    }

    if (filters.minComments) {
      const minComments = parseFormattedNumber(filters.minComments);
      if (post.commentsCount < minComments) return false;
    }

    if (filters.minEngagement) {
      const minEngagementRate = parseFloat(filters.minEngagement);
      const postEngagement = parseEngagement(post.engagement);
      if (postEngagement < minEngagementRate) return false;
    }

    return true;
  });
};