import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, ApifyRequestBody } from "./types/InstagramTypes";
import { makeApifyRequest, checkSubscriptionAndLimits } from "./services/apifyService";
import { transformToInstagramPost } from "./transformers/postTransformer";

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

function normalizeInstagramUrl(input: string): string {
  // Remove any trailing slashes and trim whitespace
  const cleanInput = input.trim().replace(/\/$/, '');
  
  // If it's already a full URL, extract just the username
  if (cleanInput.startsWith('https://www.instagram.com/')) {
    return cleanInput.replace('https://www.instagram.com/', '').split('/')[0];
  }
  
  // If it starts with @, remove it
  if (cleanInput.startsWith('@')) {
    return cleanInput.slice(1);
  }
  
  return cleanInput;
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

    const { canMakeRequest, maxRequestsPerDay } = await checkSubscriptionAndLimits(session.user.id);
    
    if (!canMakeRequest) {
      throw new Error(`Daily request limit of ${maxRequestsPerDay} reached. Please upgrade your plan for more requests.`);
    }

    await trackInstagramRequest(session.user.id);

    const normalizedUsername = normalizeInstagramUrl(username.trim());
    const instagramUrl = `https://www.instagram.com/${normalizedUsername}`;
    console.log('Normalized URL:', instagramUrl);

    const requestBody: ApifyRequestBody = {
      addParentData: false,
      directUrls: [instagramUrl],
      enhanceUserSearchWithFacebookPage: false,
      isUserReelFeedURL: false,
      isUserTaggedFeedURL: false,
      resultsLimit: numberOfVideos,
      resultsType: "stories",
      searchLimit: 1,
      searchType: "hashtag"
    };

    if (postsNewerThan) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    console.log('Making Apify request with body:', requestBody);
    const data = await makeApifyRequest(requestBody);
    console.log('Received response from Apify:', data);
    
    return Array.isArray(data) 
      ? data.map(post => transformToInstagramPost(post))
           .filter((post): post is InstagramPost => post !== null)
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

    const { canMakeRequest, maxRequestsPerDay } = await checkSubscriptionAndLimits(session.user.id);
    
    if (!canMakeRequest) {
      throw new Error(`Daily request limit of ${maxRequestsPerDay} reached. Please upgrade your plan for more requests.`);
    }

    await trackInstagramRequest(session.user.id);

    const normalizedUrls = urls.map(url => {
      const username = normalizeInstagramUrl(url.trim());
      return `https://www.instagram.com/${username}`;
    });
    console.log('Normalized URLs:', normalizedUrls);

    const requestBody: ApifyRequestBody = {
      addParentData: false,
      directUrls: normalizedUrls,
      enhanceUserSearchWithFacebookPage: false,
      isUserReelFeedURL: false,
      isUserTaggedFeedURL: false,
      resultsLimit: numberOfVideos,
      resultsType: "stories",
      searchLimit: 1,
      searchType: "hashtag"
    };

    if (postsNewerThan) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    console.log('Making bulk Apify request with body:', requestBody);
    const data = await makeApifyRequest(requestBody);
    console.log('Received bulk response from Apify:', data);
    
    return Array.isArray(data) 
      ? data.map(post => transformToInstagramPost(post))
           .filter((post): post is InstagramPost => post !== null)
      : [];
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}