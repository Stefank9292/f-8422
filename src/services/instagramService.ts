import axios from 'axios';
import type { ScrapeOptions, InstagramData, ApifyResponse } from '@/types/instagram';

const API_TOKEN = 'apify_api_k2bgBKJMfSfH16VAzFrgbeDAbUKpkO3Kl3TI';
const ACTOR_ID = 'apify/instagram-scraper';

const api = axios.create({
  baseURL: 'https://api.apify.com/v2/acts',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid API token');
        case 404:
          throw new Error('Instagram profile not found');
        case 429:
          throw new Error('Too many requests, please try again later');
        default:
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
  try {
    console.log('Starting Apify API request for username:', username);
    
    const payload = {
      username,
      resultsLimit: limit,
      maxPosts: limit,
      mediaType: ['VIDEO'],
      expandVideo: true,
      includeVideoMetadata: true,
      ...(onlyPostsNewerThan && { postsUntil: onlyPostsNewerThan.toISOString() }),
    };

    console.log('Apify API payload:', payload);

    const response = await api.post<ApifyResponse>(
      `/${ACTOR_ID}/run-sync-get-dataset-items`,
      payload,
      {
        params: {
          token: API_TOKEN
        }
      }
    );

    console.log('Apify API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in scrapeInstagramProfile:', error);
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

  const response = await api.post<ApifyResponse>(
    `/${ACTOR_ID}/run-sync-get-dataset-items`,
    payload,
    {
      params: {
        token: API_TOKEN
      }
    }
  );

  return response.data;
}