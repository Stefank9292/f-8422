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

    // Apply numeric filters in the same order as the table columns
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) {
      return false;
    }

    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) {
      return false;
    }

    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) {
      return false;
    }

    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) {
      return false;
    }

    // Handle duration filter
    if (filters.minDuration && post.duration) {
      // Split duration into minutes and seconds
      const [minutes, seconds] = post.duration.split(':').map(Number);
      const totalSeconds = (minutes * 60) + seconds;
      
      if (totalSeconds < parseInt(filters.minDuration)) {
        return false;
      }
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