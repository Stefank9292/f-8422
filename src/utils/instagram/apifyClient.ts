import { supabase } from "@/integrations/supabase/client";
import { InstagramPost } from "./types";
import { trackInstagramRequest, checkRequestLimit } from "./requestTracker";

async function fetchFromInstagramScraper(
  urls: string | string[],
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<InstagramPost[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('No authenticated session found');
  }

  const { data, error } = await supabase.functions.invoke('instagram-scraper', {
    body: { urls, numberOfVideos, postsNewerThan },
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });

  if (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }

  return data;
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

    return await fetchFromInstagramScraper(username, numberOfVideos, postsNewerThan);
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

    return await fetchFromInstagramScraper(urls, numberOfVideos, postsNewerThan);
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}