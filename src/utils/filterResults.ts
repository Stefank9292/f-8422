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

    // Filter by minimum views
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) {
      return false;
    }

    // Filter by minimum plays
    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) {
      return false;
    }

    // Filter by minimum likes
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) {
      return false;
    }

    // Filter by minimum comments
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) {
      return false;
    }

    // Filter by minimum engagement
    if (filters.minEngagement) {
      const engagement = ((post.likesCount + post.commentsCount) / post.viewsCount) * 100;
      if (engagement < parseInt(filters.minEngagement)) {
        return false;
      }
    }

    return true;
  });
};