export interface InstagramPost {
  url: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  playsCount: number;
  duration: string;
  engagement: string;
  date: string;
  type: string;
  timestamp: string;
  hashtags: string[];
  mentions: string[];
  ownerUsername: string;
  ownerId: string;
  locationName?: string;
}

export interface ApifyRequestBody {
  addParentData: boolean;
  directUrls: string[];
  enhanceUserSearchWithFacebookPage: boolean;
  isUserReelFeedURL: boolean;
  isUserTaggedFeedURL: boolean;
  resultsLimit: number;
  resultsType: string;
  searchLimit: number;
  searchType: string;
  memoryMbytes?: number;
  maxPosts: number;
  mediaTypes: string[];
  expandVideo: boolean;
  includeVideoMetadata: boolean;
  onlyPostsNewerThan?: string;
}