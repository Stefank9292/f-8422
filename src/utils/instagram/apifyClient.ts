import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, ApifyRequestBody } from "./types";
import { isInstagramPost, transformToInstagramPost } from "./validation";
import { trackInstagramRequest, checkRequestLimit } from "./requestTracker";

async function makeApifyRequest(requestBody: ApifyRequestBody): Promise<InstagramPost[]> {
  const response = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Error Response:', errorBody);
    
    if (response.status === 402) {
      throw new Error('Instagram data fetch failed: Usage quota exceeded. Please try again later or reduce the number of requested posts.');
    }
    
    throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`);
  }

  const data = await response.json();
  return Array.isArray(data) 
    ? data.map(post => transformToInstagramPost(post))
         .filter((post): post is InstagramPost => post !== null)
    : [];
}

export async function fetchInstagramPosts(
  username: string, 
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<InstagramPost[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      throw new Error('No authenticated user found');
    }

    // Check if user has reached their request limit
    const canMakeRequest = await checkRequestLimit(session.user.id);
    if (!canMakeRequest) {
      throw new Error('Daily request limit reached. Please upgrade your plan for more requests.');
    }

    // Track the request before making it
    await trackInstagramRequest(session.user.id);

    let cleanUsername = username.trim();
    if (cleanUsername.includes('instagram.com')) {
      const urlParts = cleanUsername.split('/');
      const usernameIndex = urlParts.findIndex(part => part === 'instagram.com') + 1;
      if (usernameIndex < urlParts.length) {
        cleanUsername = urlParts[usernameIndex];
      }
    }
    cleanUsername = cleanUsername.replace('@', '');
    
    const instagramUrl = `https://www.instagram.com/${cleanUsername}/`;
    console.log('Using Instagram URL:', instagramUrl);

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
      memoryMbytes: 512,
      maxPosts: numberOfVideos,
      mediaTypes: ["VIDEO"],
      expandVideo: true,
      includeVideoMetadata: true
    };

    if (postsNewerThan instanceof Date) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    return await makeApifyRequest(requestBody);
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      throw new Error('No authenticated user found');
    }

    // Check if user has reached their request limit
    const canMakeRequest = await checkRequestLimit(session.user.id);
    if (!canMakeRequest) {
      throw new Error('Daily request limit reached. Please upgrade your plan for more requests.');
    }

    // Track the request before making it (counts as one request regardless of number of URLs)
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
      includeVideoMetadata: true
    };

    if (postsNewerThan instanceof Date) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    return await makeApifyRequest(requestBody);
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}