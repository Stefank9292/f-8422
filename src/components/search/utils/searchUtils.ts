import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export const getSearchIcon = (searchType: string) => {
  const isTikTok = searchType.includes('tiktok');
  return isTikTok ? (
    <TikTokIcon className="h-3 w-3 text-muted-foreground" />
  ) : (
    <Instagram className="h-3 w-3 text-muted-foreground" />
  );
};

export const extractUsername = (query: string, searchType: string): string => {
  if (searchType.includes('tiktok')) {
    if (query.includes('tiktok.com/@')) {
      return query.split('@')[1]?.split('/')[0] || query;
    }
    return query.replace('@', '');
  }
  
  if (query.includes('instagram.com/')) {
    return query.split('instagram.com/')[1]?.split('/')[0] || query;
  }
  return query;
};