import { InstagramPost } from "@/types/instagram";
import { parse, isBefore } from "date-fns";

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
    // Handle date filtering - show posts NEWER than the selected date
    if (filters.postsNewerThan) {
      try {
        const filterDate = parse(filters.postsNewerThan, 'dd.MM.yyyy', new Date());
        const postDate = new Date(post.date);
        
        // Return false if the post is older than (before) the filter date
        if (isBefore(postDate, filterDate)) {
          return false;
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        return false;
      }
    }

    // Handle plays filter (GREEN column - playsCount)
    if (filters.minPlays && filters.minPlays !== "") {
      const minPlays = parseInt(filters.minPlays);
      if (!isNaN(minPlays)) {
        // We use playsCount for the GREEN column
        const playsCount = post.viewsCount; // Changed to viewsCount as per request
        if (typeof playsCount !== 'number' || playsCount < minPlays) {
          return false;
        }
      }
    }

    // Handle views filter (PINK column - viewsCount)
    if (filters.minViews && filters.minViews !== "") {
      const minViews = parseInt(filters.minViews);
      if (!isNaN(minViews)) {
        // We use viewsCount for the PINK column
        const viewsCount = post.playsCount; // Changed to playsCount as per request
        if (typeof viewsCount !== 'number' || viewsCount < minViews) {
          return false;
        }
      }
    }

    // Handle likes filter
    if (filters.minLikes && filters.minLikes !== "") {
      const minLikes = parseInt(filters.minLikes);
      if (!isNaN(minLikes)) {
        const likesCount = post.likesCount;
        if (typeof likesCount !== 'number' || likesCount < minLikes) {
          return false;
        }
      }
    }

    // Handle comments filter
    if (filters.minComments && filters.minComments !== "") {
      const minComments = parseInt(filters.minComments);
      if (!isNaN(minComments)) {
        const commentsCount = post.commentsCount;
        if (typeof commentsCount !== 'number' || commentsCount < minComments) {
          return false;
        }
      }
    }

    // Handle engagement filter
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