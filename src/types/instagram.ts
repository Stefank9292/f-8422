export interface InstagramPost {
  ownerUsername: string;
  caption: string;
  date: string;
  playsCount: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  duration: string;
  engagement: string;
  url: string;
  videoUrl?: string;
  timestamp?: string;
  productType?: string;
}

export interface SearchResultItem {
  id: string;
  search_history_id: string;
  results: InstagramPost[];
  created_at: string;
}

export interface SupabaseSearchResult {
  id: string;
  search_history_id: string;
  results: unknown;
  created_at: string;
}