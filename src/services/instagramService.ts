import axios from 'axios';
import type { ScrapeOptions, InstagramData, ApifyResponse } from '@/types/instagram';

const API_TOKEN = 'apify_api_k2bgBKJMfSfH16VAzFrgbeDAbUKpkO3Kl3TI';
const ACTOR_ID = 'apify/instagram-scraper';

const api = axios.create({
  baseURL: 'https://api.apify.com/v2/acts',
  timeout: 60000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Invalid API token');
          throw new Error('Invalid API token');
        case 404:
          console.error('Instagram profile not found');
          throw new Error('Instagram profile not found');
        case 429:
          console.error('Rate limit exceeded');
          throw new Error('Too many requests, please try again later');
        default:
          console.error('API Error:', error.response.data);
          throw new Error('Failed to fetch Instagram data');
      }
    }
    throw error;
  }
);

export async function scrapeInstagramProfile(
  username: string,
  limit: number = 3,
  onlyPostsNewerThan?: Date
): Promise<InstagramData[]> {
  const payload = {
    username,
    resultsLimit: limit,
    maxPosts: limit,
    mediaType: ['VIDEO'],
    expandVideo: true,
    includeVideoMetadata: true,
    ...(onlyPostsNewerThan && { postsUntil: onlyPostsNewerThan.toISOString() }),
  };

  try {
    console.log('Fetching Instagram posts for:', username);
    const response = await api.post<ApifyResponse>(
      `/${ACTOR_ID}/run-sync-get-dataset-items?token=${API_TOKEN}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}

export async function scrapeInstagramUrls({ 
  urls = [], 
  limit = 3, 
  onlyPostsNewerThan 
}: ScrapeOptions): Promise<InstagramData[]> {
  if (!urls.length) {
    throw new Error('No URLs provided');
  }

  const payload = {
    directUrls: urls,
    resultsLimit: limit,
    maxPosts: limit,
    mediaType: ['VIDEO'],
    expandVideo: true,
    includeVideoMetadata: true,
    ...(onlyPostsNewerThan && { postsUntil: onlyPostsNewerThan.toISOString() }),
  };

  try {
    console.log('Fetching Instagram posts for URLs:', urls);
    const response = await api.post<ApifyResponse>(
      `/${ACTOR_ID}/run-sync-get-dataset-items?token=${API_TOKEN}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}