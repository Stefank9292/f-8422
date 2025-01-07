import { supabase } from "@/integrations/supabase/client";
import { ApifyRequestBody, InstagramPost } from '../types/InstagramTypes';
import { transformToInstagramPost } from '../validation/postValidator';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequestWithRetry(requestBody: ApifyRequestBody, retries = 0): Promise<InstagramPost[]> {
  try {
    const { data, error } = await supabase.functions.invoke('instagram-scraper', {
      body: requestBody
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      
      // Handle rate limiting
      if (error.message.includes('Rate limit exceeded')) {
        const retryAfter = parseInt(error.message.match(/\d+/)?.[0] || '60');
        await delay(retryAfter * 1000);
        return makeRequestWithRetry(requestBody, retries);
      }

      throw error;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid response from Edge Function:', data);
      throw new Error('Invalid response from Instagram scraper');
    }

    return data.map(post => transformToInstagramPost(post))
               .filter((post): post is InstagramPost => post !== null);
  } catch (error) {
    console.error(`Attempt ${retries + 1} failed:`, error);

    if (retries < MAX_RETRIES) {
      await delay(RETRY_DELAY * Math.pow(2, retries)); // Exponential backoff
      return makeRequestWithRetry(requestBody, retries + 1);
    }

    throw error;
  }
}

export async function checkSubscriptionAndLimits(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const { count } = await supabase
    .from('user_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('request_type', 'instagram_search')
    .gte('created_at', startOfDay.toISOString())
    .lt('created_at', endOfDay.toISOString());

  const maxRequestsPerDay = 100; // Default daily limit
  return {
    canMakeRequest: (count || 0) < maxRequestsPerDay,
    maxRequestsPerDay
  };
}

export async function makeApifyRequest(requestBody: ApifyRequestBody): Promise<InstagramPost[]> {
  console.log('Making Apify request with body:', requestBody);
  return makeRequestWithRetry(requestBody);
}

export async function fetchInstagramPosts(
  username: string, 
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<InstagramPost[]> {
  try {
    await updateUserClickCount();
    
    console.log('Fetching Instagram posts for:', username);
    console.log('Number of videos requested:', numberOfVideos);
    console.log('Posts newer than:', postsNewerThan ? new Date(postsNewerThan).toLocaleString() : 'No date filter');
    
    const instagramUrl = `https://www.instagram.com/${username.replace('@', '')}/`;
    const requestBody: ApifyRequestBody = {
      addParentData: false,
      directUrls: [instagramUrl],
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
      memoryMbytes: 512
    };

    if (postsNewerThan instanceof Date) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    const posts = await makeApifyRequest(requestBody);
    console.log('Processed posts:', posts);
    return posts;
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
    await updateUserClickCount();
    
    console.log('Fetching bulk Instagram posts for URLs:', urls);
    console.log('Number of videos per profile:', numberOfVideos);
    console.log('Posts newer than:', postsNewerThan ? new Date(postsNewerThan).toLocaleString() : 'No date filter');

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
      memoryMbytes: 512
    };

    if (postsNewerThan instanceof Date) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    const posts = await makeApifyRequest(requestBody);
    console.log('Processed bulk posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}

async function updateUserClickCount() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user.id) return;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  await supabase
    .from('user_requests')
    .insert({
      user_id: session.user.id,
      request_type: 'instagram_search',
      period_start: startOfDay.toISOString(),
      period_end: endOfDay.toISOString()
    });
}