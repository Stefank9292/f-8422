import { Json } from "@/integrations/supabase/types";

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
  customMapFunction?: string;
  dateRange: string;
  location: string;
  maxItems: number;
  startUrls: string[];
}
