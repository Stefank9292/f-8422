import { InstagramPost } from "@/types/instagram";
import { parse, isAfter } from "date-fns";

export interface FilterState {
  postsNewerThan: string;
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minDuration: string;
  minEngagement: string;
}

export const filterResults = (results: InstagramPost[], filters: FilterState) => {
  return results.filter(post => {
    // Handle date filtering
    if (filters.postsNewerThan) {
      try {
        // Parse the filter date from dd.MM.yyyy format
        const filterDate = parse(filters.postsNewerThan, 'dd.MM.yyyy', new Date());
        
        // Parse the post date (assuming it's in ISO format)
        const postDate = new Date(post.date);
        
        // Return false if the post date is before the filter date
        if (!isAfter(postDate, filterDate)) {
          return false;
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        return false;
      }
    }

    // Apply numeric filters, matching the table column order
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) return false;
    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) return false;
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    
    // Handle duration filter if present
    if (filters.minDuration && post.duration) {
      const postDuration = parseInt(post.duration.split(':')[0]) * 60 + parseInt(post.duration.split(':')[1]);
      if (postDuration < parseInt(filters.minDuration)) return false;
    }
    
    // Handle engagement filter
    if (filters.minEngagement) {
      const postEngagement = parseFloat(post.engagement.replace('%', ''));
      if (postEngagement < parseFloat(filters.minEngagement)) return false;
    }

    return true;
  });
};