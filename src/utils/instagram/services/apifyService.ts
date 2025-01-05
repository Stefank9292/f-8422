import { supabase } from "@/integrations/supabase/client";
import { APIFY_CONFIG, APIFY_BASE_ENDPOINT } from '../config/apifyConfig';
import { ApifyRequestBody, InstagramPost } from '../types/InstagramTypes';
import { transformToInstagramPost } from '../validation/postValidator';

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
  console.log('Making Apify request with config:', { ...APIFY_CONFIG, requestBody });
  
  try {
    // Get the API key from Supabase Functions
    const { data: apifyKeyData, error: keyError } = await supabase.functions.invoke('get-apify-key');
    
    if (keyError) {
      console.error('Failed to invoke get-apify-key function:', keyError);
      throw new Error('Failed to get Apify API key: ' + keyError.message);
    }
    
    if (!apifyKeyData?.key) {
      console.error('No API key returned from get-apify-key function');
      throw new Error('No Apify API key available');
    }

    const response = await fetch(`${APIFY_BASE_ENDPOINT}?token=${apifyKeyData.key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestBody,
        ...APIFY_CONFIG
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      
      if (response.status === 402) {
        throw new Error('Instagram data fetch failed: Usage quota exceeded. Please try again later or reduce the number of requested posts.');
      }
      
      throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`);
    }

    const responseData = await response.json();
    console.log('Received response from Apify:', responseData);
    
    return Array.isArray(responseData) 
      ? responseData.map(post => transformToInstagramPost(post))
           .filter((post): post is InstagramPost => post !== null)
      : [];
  } catch (error) {
    console.error('Error in makeApifyRequest:', error);
    throw error;
  }
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
      memoryMbytes: APIFY_CONFIG.memoryMbytes
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
      memoryMbytes: APIFY_CONFIG.memoryMbytes
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