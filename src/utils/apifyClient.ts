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

function isInstagramPost(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const post = obj as Record<string, unknown>;
  
  try {
    const likesCount = Number(post.likesCount) || 0;
    const commentsCount = Number(post.commentsCount) || 0;
    const viewsCount = Number(post.viewsCount) || 0;
    
    // Check if the object has all required properties with correct types
    const hasRequiredProps = 
      typeof (post.url === 'string' || post.shortCode === 'string') &&
      typeof post.caption === 'string' &&
      typeof likesCount === 'number' &&
      typeof commentsCount === 'number' &&
      typeof viewsCount === 'number' &&
      typeof post.videoPlayCount === 'number' || post.videoPlayCount === undefined &&
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
    const viewsCount = Number(post.viewsCount) || 0;
    
    const transformedPost: InstagramPost = {
      url: typeof post.url === 'string' ? post.url : 
           typeof post.shortCode === 'string' ? `https://www.instagram.com/p/${post.shortCode}` : '',
      caption: typeof post.caption === 'string' ? post.caption : '',
      likesCount,
      commentsCount,
      viewsCount,
      playsCount: Number(post.videoPlayCount) || 0,
      duration: typeof post.videoDuration === 'string' ? post.videoDuration : '0:00',
      engagement: `${((likesCount + commentsCount) / (viewsCount || 1) * 100).toFixed(2)}%`,
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

    // Prepare request body according to Apify API specifications
    const requestBody: Record<string, any> = {
      "addParentData": false,
      "directUrls": [instagramUrl],
      "enhanceUserSearchWithFacebookPage": false,
      "isUserReelFeedURL": false,
      "isUserTaggedFeedURL": false,
      "resultsLimit": numberOfVideos,
      "resultsType": "stories",
      "searchLimit": 1,
      "searchType": "hashtag"
    };

    // Only add postsUntil if a date is provided
    if (postsNewerThan instanceof Date) {
      requestBody.postsUntil = postsNewerThan.toISOString();
      console.log('Including posts until:', postsNewerThan);
    }

    // Make the API request to Apify
    const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1`;
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Apify API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw response from Apify:', data);

    // Transform and validate the data
    const validPosts = Array.isArray(data) 
      ? data.map(post => transformToInstagramPost(post))
           .filter((post): post is InstagramPost => post !== null)
      : [];
           
    console.log('Valid posts:', validPosts);

    return validPosts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}