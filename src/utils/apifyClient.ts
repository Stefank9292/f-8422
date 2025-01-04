import { supabase } from "@/integrations/supabase/client";

interface InstagramPost {
  url: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  playsCount: number;
  duration: string;
  engagement: string;
  date: string;
  type: string;
  timestamp: string;
  hashtags: string[];
  mentions: string[];
  ownerUsername: string;
  ownerId: string;
  locationName?: string;
}

async function updateUserClickCount() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user.id) return;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // First, try to get existing record for today
  const { data: existingRecord } = await supabase
    .from('user_requests')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('period_end', startOfDay.toISOString())
    .lt('period_end', endOfDay.toISOString())
    .single();

  if (existingRecord) {
    // Update existing record
    await supabase
      .from('user_requests')
      .update({ request_count: existingRecord.request_count + 1 })
      .eq('id', existingRecord.id);
  } else {
    // Create new record
    await supabase
      .from('user_requests')
      .insert({
        user_id: session.user.id,
        request_count: 1,
        period_start: startOfDay.toISOString(),
        period_end: endOfDay.toISOString()
      });
  }
}

function isInstagramPost(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const post = obj as Record<string, unknown>;
  
  try {
    const likesCount = Number(post.likesCount) || 0;
    const commentsCount = Number(post.commentsCount) || 0;
    const videoViewCount = Number(post.videoViewCount) || 0;
    const videoPlayCount = Number(post.videoPlayCount) || 0;
    
    // Check if the object has all required properties with correct types
    const hasRequiredProps = 
      typeof (post.url === 'string' || post.shortCode === 'string') &&
      typeof post.caption === 'string' &&
      typeof likesCount === 'number' &&
      typeof commentsCount === 'number' &&
      typeof videoViewCount === 'number' &&
      typeof videoPlayCount === 'number' &&
      typeof post.videoDuration === 'string' || post.videoDuration === undefined &&
      typeof post.timestamp === 'string' || post.timestamp === undefined &&
      typeof post.type === 'string' || post.type === undefined &&
      Array.isArray(post.hashtags) &&
      Array.isArray(post.mentions) &&
      typeof post.ownerUsername === 'string' &&
      typeof post.ownerId === 'string';

    if (!hasRequiredProps) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating post data:', error);
    return false;
  }
}

function transformToInstagramPost(obj: unknown): InstagramPost | null {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  
  const post = obj as Record<string, unknown>;
  
  try {
    const likesCount = Number(post.likesCount) || 0;
    const commentsCount = Number(post.commentsCount) || 0;
    const videoViewCount = Number(post.videoViewCount) || 0;
    const videoPlayCount = Number(post.videoPlayCount) || 0;
    
    const transformedPost: InstagramPost = {
      url: typeof post.url === 'string' ? post.url : 
           typeof post.shortCode === 'string' ? `https://www.instagram.com/p/${post.shortCode}` : '',
      caption: typeof post.caption === 'string' ? post.caption : '',
      likesCount,
      commentsCount,
      viewsCount: videoViewCount, // Use videoViewCount for views
      playsCount: videoPlayCount, // Use videoPlayCount for plays
      duration: typeof post.videoDuration === 'string' ? post.videoDuration : '0:00',
      engagement: `${((likesCount + commentsCount) / (videoPlayCount || 1) * 100).toFixed(2)}%`,
      date: typeof post.timestamp === 'string' ? new Date(post.timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
      type: typeof post.type === 'string' ? post.type : 'Post',
      timestamp: typeof post.timestamp === 'string' ? post.timestamp : new Date().toISOString(),
      hashtags: Array.isArray(post.hashtags) ? post.hashtags.filter(tag => typeof tag === 'string') : [],
      mentions: Array.isArray(post.mentions) ? post.mentions.filter(mention => typeof mention === 'string') : [],
      ownerUsername: typeof post.ownerUsername === 'string' ? post.ownerUsername : '',
      ownerId: typeof post.ownerId === 'string' ? post.ownerId : '',
      locationName: typeof post.locationName === 'string' ? post.locationName : undefined
    };

    return transformedPost;
  } catch (error) {
    console.error('Error transforming post data:', error);
    return null;
  }
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

    const requestBody: Record<string, any> = {
      "addParentData": false,
      "directUrls": [instagramUrl],
      "enhanceUserSearchWithFacebookPage": false,
      "isUserReelFeedURL": false,
      "isUserTaggedFeedURL": false,
      "resultsLimit": numberOfVideos,
      "resultsType": "posts",
      "searchLimit": 1,
      "searchType": "user",
      "memoryMbytes": 512,
      "maxPosts": numberOfVideos,
      "mediaTypes": ["VIDEO"],
      "expandVideo": true,
      "includeVideoMetadata": true
    };

    if (postsNewerThan instanceof Date) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    console.log('Making request with body:', JSON.stringify(requestBody, null, 2));
    
    const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1`;
    
    const response = await fetch(apiEndpoint, {
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

    // Only track request if we got valid posts
    if (validPosts.length > 0) {
      await updateUserClickCount();
    }

    return validPosts;
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

    const cleanUrls = urls.map(url => {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('https://')) {
        cleanUrl = `https://www.instagram.com/${cleanUrl.replace('@', '')}/`;
      }
      return cleanUrl;
    });

    const requestBody: Record<string, any> = {
      "addParentData": false,
      "directUrls": cleanUrls,
      "enhanceUserSearchWithFacebookPage": false,
      "isUserReelFeedURL": false,
      "isUserTaggedFeedURL": false,
      "resultsLimit": numberOfVideos,
      "resultsType": "posts",
      "searchLimit": 1,
      "searchType": "user",
      "maxPosts": numberOfVideos,
      "mediaTypes": ["VIDEO"],
      "expandVideo": true,
      "includeVideoMetadata": true
    };

    if (postsNewerThan instanceof Date) {
      requestBody.onlyPostsNewerThan = postsNewerThan.toISOString().split('T')[0];
    }

    console.log('Making bulk request with body:', JSON.stringify(requestBody, null, 2));

    const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1`;

    const response = await fetch(apiEndpoint, {
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

    // Only track request if we got valid posts
    if (validPosts.length > 0) {
      await updateUserClickCount();
    }

    return validPosts;
  } catch (error) {
    console.error('Error fetching bulk Instagram posts:', error);
    throw error;
  }
}
