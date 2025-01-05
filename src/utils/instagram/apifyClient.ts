import { supabase } from "@/integrations/supabase/client";
import { InstagramPost } from "./types";
import { transformToInstagramPost } from "./validation";
import { trackInstagramRequest, checkRequestLimit } from "./requestTracker";

export async function fetchInstagramPosts(
  username: string, 
  numberOfVideos: number = 3,
  postsNewerThan?: Date,
  signal?: AbortSignal
): Promise<InstagramPost[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
      throw new Error('No authenticated user found');
    }

    // Get subscription status
    const { data: subscriptionStatus } = await supabase.functions.invoke('check-subscription', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    // Check if user is on Steroids plan (unlimited requests)
    const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                          subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";

    // Only check request limit for non-Steroids users
    if (!isSteroidsUser) {
      const canMakeRequest = await checkRequestLimit(session.user.id);
      if (!canMakeRequest) {
        throw new Error('Daily request limit reached. Please upgrade your plan for more requests.');
      }
    }

    // Track the request before making it
    await trackInstagramRequest(session.user.id);

    console.log('Using Instagram URL:', username);

    const { data, error } = await supabase.functions.invoke('instagram-scraper', {
      body: {
        username,
        numberOfVideos,
        postsNewerThan
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      },
      signal // Pass the abort signal to the fetch request
    });

    if (error) throw error;

    return Array.isArray(data) 
      ? data.map(post => transformToInstagramPost(post))
           .filter((post): post is InstagramPost => post !== null)
      : [];
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Search request was cancelled');
      return [];
    }
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

    // Get subscription status
    const { data: subscriptionStatus } = await supabase.functions.invoke('check-subscription', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    // Check if user is on Steroids plan (unlimited requests)
    const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                          subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";

    // Only check request limit for non-Steroids users
    if (!isSteroidsUser) {
      const canMakeRequest = await checkRequestLimit(session.user.id);
      if (!canMakeRequest) {
        throw new Error('Daily request limit reached. Please upgrade your plan for more requests.');
      }
    }

    // Track the request before making it (counts as one request regardless of number of URLs)
    await trackInstagramRequest(session.user.id);

    const results = await Promise.all(
      urls.map(async (url) => {
        const { data, error } = await supabase.functions.invoke('instagram-scraper', {
          body: {
            username: url,
            numberOfVideos,
            postsNewerThan
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });

        if (error) throw error;
        return data;
      })
    );

    const allPosts = results.flat();
    return Array.isArray(allPosts)
      ? allPosts.map(post => transformToInstagramPost(post))
           .filter((post): post is InstagramPost => post !== null)
      : [];
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}