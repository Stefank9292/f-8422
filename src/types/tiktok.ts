export interface TikTokPost {
  username: string;
  caption: string;
  date: string;
  viewsCount: number;
  sharesCount: number;
  likesCount: number;
  commentsCount: number;
  engagement: string;
  url: string;
  videoUrl?: string;
  timestamp?: string;
}

export interface TikTokSearchResult {
  id: string;
  search_history_id: string;
  created_at: string;
  results: TikTokPost[];
}

export interface LocationOption {
  label: string;
  value: string;
}