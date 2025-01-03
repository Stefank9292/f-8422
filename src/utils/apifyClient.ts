import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: 'apify_api_token',
});

interface InstagramPost {
  url: string;
  // Add other properties that you expect from the Instagram post
  [key: string]: unknown; // Allow other properties
}

// Type guard function to check if an object is an InstagramPost
function isInstagramPost(obj: unknown): obj is InstagramPost {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const post = obj as Record<string, unknown>;
  return typeof post.url === 'string';
}

export async function fetchInstagramPosts(username: string): Promise<InstagramPost[]> {
  try {
    console.log('Fetching Instagram posts for:', username);

    // Start the actor and wait for it to finish
    const run = await client.actor('apify/instagram-scraper').call({
      username: username,
      resultsLimit: 10,
    });

    console.log('Actor finished, fetching results...');

    // Fetch the actor's output
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log('Raw items from API:', items);

    // Validate and transform the data
    const validPosts = (items as unknown[]).filter((item): item is InstagramPost => {
      if (!isInstagramPost(item)) {
        console.warn('Invalid post data structure:', item);
        return false;
      }
      return true;
    });

    console.log('Valid posts:', validPosts);
    return validPosts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}