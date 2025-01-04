import { InstagramPost, ApifyRequestBody } from './types';
import { isInstagramPost, transformToInstagramPost } from './validation';

const APIFY_API_ENDPOINT = 'https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1';

async function makeApifyRequest(requestBody: ApifyRequestBody): Promise<InstagramPost[]> {
  const response = await fetch(APIFY_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Error Response:', errorBody);
    
    if (response.status === 402) {
      throw new Error('Instagram data fetch failed: Usage quota exceeded. Please try again later or reduce the number of requested posts.');
    }
    
    throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`);
  }

  const data = await response.json();
  console.log('Raw response from Apify:', data);

  const validPosts = Array.isArray(data) 
    ? data.map(post => transformToInstagramPost(post))
         .filter((post): post is InstagramPost => post !== null)
    : [];
         
  console.log('Valid posts:', validPosts);

  return validPosts;
}

function createRequestBody(
  urls: string[], 
  numberOfVideos: number = 3, 
  postsNewerThan?: Date
): ApifyRequestBody {
  const requestBody: ApifyRequestBody = {
    addParentData: false,
    directUrls: urls,
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
    includeVideoMetadata: true,
    productType: ["clips"] // Only return clips
  };

  if (postsNewerThan instanceof Date) {
    requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
  }

  return requestBody;
}

export async function fetchInstagramPosts(
  username: string, 
  numberOfVideos: number = 3,
  postsNewerThan?: Date
): Promise<InstagramPost[]> {
  try {
    console.log('Fetching Instagram posts for:', username);
    console.log('Number of videos requested:', numberOfVideos);
    console.log('Posts newer than:', postsNewerThan ? new Date(postsNewerThan).toLocaleString() : 'No date filter');
    
    // Clean up username and handle URL input
    let cleanUsername = username.trim();
    
    // If the input is a URL, extract the username
    if (cleanUsername.includes('instagram.com')) {
      const urlParts = cleanUsername.split('/');
      // Find the username part after instagram.com
      const usernameIndex = urlParts.findIndex(part => part === 'instagram.com') + 1;
      if (usernameIndex < urlParts.length) {
        cleanUsername = urlParts[usernameIndex];
      }
    }
    
    // Remove @ if present
    cleanUsername = cleanUsername.replace('@', '');
    
    // Construct proper Instagram URL with trailing slash
    const instagramUrl = `https://www.instagram.com/${cleanUsername}/`;
    console.log('Using Instagram URL:', instagramUrl);

    const requestBody = createRequestBody([instagramUrl], numberOfVideos, postsNewerThan);
    console.log('Making request with body:', JSON.stringify(requestBody, null, 2));
    
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
    console.log('Fetching bulk Instagram posts for URLs:', urls);
    console.log('Number of videos per profile:', numberOfVideos);
    console.log('Posts newer than:', postsNewerThan ? new Date(postsNewerThan).toLocaleString() : 'No date filter');

    // Clean up URLs and ensure they're properly formatted
    const cleanUrls = urls.map(url => {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('https://')) {
        cleanUrl = `https://www.instagram.com/${cleanUrl.replace('@', '')}/`;
      }
      return cleanUrl;
    });

    const requestBody = createRequestBody(cleanUrls, numberOfVideos, postsNewerThan);
    console.log('Making bulk request with body:', JSON.stringify(requestBody, null, 2));

    return await makeApifyRequest(requestBody);
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}