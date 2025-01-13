export interface TikTokPost {
  id: string;
  shortcode: string;
  caption: string;
  timestamp: string;
  date: string;
  dimensions: {
    height: number;
    width: number;
  };
  displayUrl: string;
  videoUrl: string;
  playsCount: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  ownerUsername: string;
  engagement: number;
}

export interface TikTokApifyRequestBody {
  username: string;
  maxPostCount: number;
  dateFilter: string;
  region: string;
  proxy?: {
    useApifyProxy?: boolean;
    apifyProxyGroups?: string[];
  };
}