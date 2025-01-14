export interface SearchResult {
  id: string;
  url: string;
  caption: string;
  date: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  engagement: string;
  ownerUsername: string;
}

export interface FilterState {
  postsNewerThan: string;
  minViews: string;
  minPlays: string;
  minLikes: string;
  minComments: string;
  minEngagement: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalResults: number;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}