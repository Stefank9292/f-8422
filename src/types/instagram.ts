export interface ScrapeOptions {
  urls?: string[];
  username?: string;
  limit?: number;
  onlyPostsNewerThan?: Date;
}

export interface InstagramData {
  id: string;
  type: string;
  shortCode: string;
  caption: string;
  url: string;
  commentsCount: number;
  likesCount: number;
  timestamp: string;
  videoUrl?: string;
  videoPlayCount?: number;
  videoViewCount?: number;
  videoDuration?: number;
  displayUrl?: string;
  ownerUsername: string;
}

export interface ApifyResponse {
  data: InstagramData[];
}