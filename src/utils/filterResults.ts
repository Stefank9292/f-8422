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

    // Handle views filter with proper type checking and validation
    if (filters.minViews && filters.minViews !== "") {
      const minViews = parseInt(filters.minViews);
      if (!isNaN(minViews)) {
        const postViews = typeof post.viewsCount === 'number' ? post.viewsCount : 0;
        if (postViews < minViews) {
          return false;
        }
      }
    }

    // Handle plays filter with proper type checking and validation
    if (filters.minPlays && filters.minPlays !== "") {
      const minPlays = parseInt(filters.minPlays);
      if (!isNaN(minPlays)) {
        const postPlays = typeof post.playsCount === 'number' ? post.playsCount : 0;
        if (postPlays < minPlays) {
          return false;
        }
      }
    }

    // Handle likes filter
    if (filters.minLikes && filters.minLikes !== "") {
      const minLikes = parseInt(filters.minLikes);
      if (!isNaN(minLikes) && post.likesCount < minLikes) {
        return false;
      }
    }

    // Handle comments filter
    if (filters.minComments && filters.minComments !== "") {
      const minComments = parseInt(filters.minComments);
      if (!isNaN(minComments) && post.commentsCount < minComments) {
        return false;
      }
    }

    // Handle engagement filter (remove % and convert to number)
    if (filters.minEngagement && filters.minEngagement !== "") {
      const minEngagement = parseFloat(filters.minEngagement);
      if (!isNaN(minEngagement) && post.engagement) {
        const engagementValue = parseFloat(post.engagement.replace('%', ''));
        if (isNaN(engagementValue) || engagementValue < minEngagement) {
          return false;
        }
      }
    }

    return true;
  });
};