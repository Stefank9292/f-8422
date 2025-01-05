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

    // Fix: Correctly apply playsCount and viewsCount filters
    if (filters.minPlays && post.viewsCount < parseInt(filters.minPlays)) return false;
    if (filters.minViews && post.playsCount < parseInt(filters.minViews)) return false;
    
    // Handle other numeric filters
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    if (filters.minDuration && post.duration < filters.minDuration) return false;
    if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;

    return true;
  });
};