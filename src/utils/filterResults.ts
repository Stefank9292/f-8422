import { InstagramPost } from "@/types/instagram";

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
    if (filters.postsNewerThan) {
      const [day, month, year] = filters.postsNewerThan.split('.');
      const filterDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const postDate = new Date(post.timestamp);
      if (postDate < filterDate) return false;
    }
    if (filters.minViews && post.viewsCount < parseInt(filters.minViews)) return false;
    if (filters.minPlays && post.playsCount < parseInt(filters.minPlays)) return false;
    if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
    if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
    if (filters.minDuration && post.duration < filters.minDuration) return false;
    if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;

    return true;
  });
};