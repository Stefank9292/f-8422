import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, ApifyRequestBody } from "./types/InstagramTypes";
import { makeApifyRequest } from "./services/apifyService";
import { APIFY_CONFIG } from "./config/apifyConfig";

async function trackInstagramRequest(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  await supabase
    .from('user_requests')
    .insert({
      user_id: userId,
      request_type: 'instagram_search',
      period_start: startOfDay.toISOString(),
      period_end: endOfDay.toISOString()
    });
}

export async function fetchInstagramPosts(
  username: string, 
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<InstagramPost[]> {
  try {
    console.log('Starting fetchInstagramPosts for:', username);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      throw new Error('No authenticated user found');
    }

    await trackInstagramRequest(session.user.id);

    const requestBody: ApifyRequestBody = {
      addParentData: false,
      directUrls: [`https://www.instagram.com/${username.replace('@', '')}/`],
      enhanceUserSearchWithFacebookPage: false,
      isUserReelFeedURL: false,
      isUserTaggedFeedURL: false,
      resultsLimit: numberOfVideos,
      resultsType: "posts",
      searchLimit: 1,
      searchType: "user",
      maxPosts: numberOfVideos,
      mediaTypes: ["VIDEO"],
      expandVideo: true,
      includeVideoMetadata: true,
      ...APIFY_CONFIG
    };

    if (postsNewerThan) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    console.log('Making Apify request with optimized configuration');
    const data = await makeApifyRequest(requestBody);
    
    return Array.isArray(data) 
      ? data.filter(post => post !== null)
      : [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}

export async function fetchBulkInstagramPosts(
  urls: string[],
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<InstagramPost[]> {
  try {
    console.log('Starting fetchBulkInstagramPosts for URLs:', urls);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      throw new Error('No authenticated user found');
    }

    await trackInstagramRequest(session.user.id);

    const cleanUrls = urls.map(url => {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('https://')) {
        cleanUrl = `https://www.instagram.com/${cleanUrl.replace('@', '')}/`;
      }
      return cleanUrl;
    });

    const requestBody: ApifyRequestBody = {
      addParentData: false,
      directUrls: cleanUrls,
      enhanceUserSearchWithFacebookPage: false,
      isUserReelFeedURL: false,
      isUserTaggedFeedURL: false,
      resultsLimit: numberOfVideos,
      resultsType: "posts",
      searchLimit: 1,
      searchType: "user",
      maxPosts: numberOfVideos,
      mediaTypes: ["VIDEO"],
      expandVideo: true,
      includeVideoMetadata: true,
      ...APIFY_CONFIG
    };

    if (postsNewerThan) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    console.log('Making bulk Apify request with optimized configuration');
    const data = await makeApifyRequest(requestBody);
    
    return Array.isArray(data) 
      ? data.filter(post => post !== null)
      : [];
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}