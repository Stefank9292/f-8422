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

export const filterResults = (results: InstagramPost[], filters: FilterState) => {
  return results.filter(post => {
    // Handle date filtering
    if (filters.postsNewerThan) {
      try {
        const filterDate = parse(filters.postsNewerThan, 'dd.MM.yyyy', new Date());
        const postDate = new Date(post.date);
        
        if (!isAfter(postDate, filterDate)) {
          return false;
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        return false;
      }
    }

    // Handle views filter - ensure proper numeric comparison
    if (filters.minViews && filters.minViews !== "") {
      const minViews = parseInt(filters.minViews);
      const postViews = post.viewsCount || 0;
      
      if (isNaN(minViews) || postViews < minViews) {
        return false;
      }
    }

    // Handle plays filter - ensure proper numeric comparison
    if (filters.minPlays && filters.minPlays !== "") {
      const minPlays = parseInt(filters.minPlays);
      const postPlays = post.playsCount || 0;
      
      if (isNaN(minPlays) || postPlays < minPlays) {
        return false;
      }
    }

    // Handle likes filter
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) {
      return false;
    }

    // Handle comments filter
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) {
      return false;
    }

    // Handle engagement filter (remove % and convert to number)
    if (filters.minEngagement && post.engagement) {
      const engagementValue = parseFloat(post.engagement.replace('%', ''));
      if (engagementValue < parseFloat(filters.minEngagement)) {
        return false;
      }
    }

    return true;
  });
};