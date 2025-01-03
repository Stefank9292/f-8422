import axios from 'axios';
import type { ScrapeOptions, InstagramData } from '@/types/instagram';

const API_TOKEN = 'apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1';
const ACTOR_TASK = 'stefankaralic92~instagram-scraper-task';

const api = axios.create({
  baseURL: 'https://api.apify.com/v2/actor-tasks',
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
    maxPosts: limit,
    resultsLimit: limit,
    mediaTypes: ['VIDEO'],
    expandVideo: true,
    includeVideoMetadata: true,
    directUrls: [`https://www.instagram.com/${username}`],
    ...(onlyPostsNewerThan && { postsUntil: onlyPostsNewerThan.toISOString() }),
  };

  try {
    console.log('Fetching Instagram posts for:', username);
    const response = await api.post<{ data: InstagramData[] }>(
      `/${ACTOR_TASK}/run-sync-get-dataset-items?token=${API_TOKEN}`,
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
    maxPosts: limit,
    resultsLimit: limit,
    mediaTypes: ['VIDEO'],
    expandVideo: true,
    includeVideoMetadata: true,
    ...(onlyPostsNewerThan && { postsUntil: onlyPostsNewerThan.toISOString() }),
  };

  try {
    console.log('Fetching Instagram posts for URLs:', urls);
    const response = await api.post<{ data: InstagramData[] }>(
      `/${ACTOR_TASK}/run-sync-get-dataset-items?token=${API_TOKEN}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}