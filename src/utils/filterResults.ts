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
  return posts.filter(post => {
    // Filter by date
    if (filters.postsNewerThan) {
      try {
        const filterDate = parse(filters.postsNewerThan, 'dd.MM.yyyy', new Date());
        const postDate = new Date(post.timestamp);
        
        // Return false if the post is older than the filter date
        if (!isAfter(postDate, filterDate)) {
          return false;
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }

    // Filter by minimum views
    if (filters.minViews && post.views < parseInt(filters.minViews)) {
      return false;
    }

    // Filter by minimum plays
    if (filters.minPlays && post.plays < parseInt(filters.minPlays)) {
      return false;
    }

    // Filter by minimum likes
    if (filters.minLikes && post.likes < parseInt(filters.minLikes)) {
      return false;
    }

    // Filter by minimum comments
    if (filters.minComments && post.comments < parseInt(filters.minComments)) {
      return false;
    }

    // Filter by minimum engagement
    if (filters.minEngagement) {
      const engagement = ((post.likes + post.comments) / post.views) * 100;
      if (engagement < parseInt(filters.minEngagement)) {
        return false;
      }
    }

    return true;
  });
};