import { InstagramPost } from "@/types/instagram";
import { parse, isAfter } from "date-fns";

export interface FilterState {
  postsNewerThan: string;
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
}

const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  // Remove dots (thousand separators) and replace comma with dot for decimal
  return parseInt(value.replace(/\./g, '').replace(',', '.'));
};

const parseEngagement = (engagement: string): number => {
  // Remove the '%' symbol and convert to number
  return parseFloat(engagement.replace('%', ''));
};

export const filterResults = (posts: InstagramPost[], filters: FilterState) => {
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

    // Filter by minimum views (now checking against playsCount)
    if (filters.minViews) {
      const minViews = parseFormattedNumber(filters.minViews);
      if (post.playsCount < minViews) {
        return false;
      }
    }

    // Filter by minimum plays (now checking against viewsCount)
    if (filters.minPlays) {
      const minPlays = parseFormattedNumber(filters.minPlays);
      if (post.viewsCount < minPlays) {
        return false;
      }
    }

    // Filter by minimum likes
    if (filters.minLikes) {
      const minLikes = parseFormattedNumber(filters.minLikes);
      if (post.likesCount < minLikes) {
        return false;
      }
    }

    // Filter by minimum comments
    if (filters.minComments) {
      const minComments = parseFormattedNumber(filters.minComments);
      if (post.commentsCount < minComments) {
        return false;
      }
    }

    // Filter by minimum engagement
    if (filters.minEngagement) {
      const minEngagementRate = parseFloat(filters.minEngagement);
      const postEngagement = parseEngagement(post.engagement);
      if (postEngagement < minEngagementRate) {
        return false;
      }
    }

    return true;
  });
};