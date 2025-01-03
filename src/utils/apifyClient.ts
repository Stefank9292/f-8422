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

function isInstagramPost(obj: unknown): obj is InstagramPost {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const post = obj as Record<string, unknown>;
  
  // Transform and validate the data from Apify's format to our format
  try {
    return {
      url: post.url || post.shortCode && `https://www.instagram.com/p/${post.shortCode}`,
      caption: post.caption || '',
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      viewsCount: post.viewsCount || 0,
      playsCount: post.videoPlayCount || 0,
      duration: post.videoDuration || '0:00',
      engagement: ((post.likesCount || 0) + (post.commentsCount || 0)) / (post.viewsCount || 1) * 100 + '%',
      date: new Date(post.timestamp || Date.now()).toLocaleDateString(),
      type: post.type || 'Post',
      timestamp: post.timestamp || new Date().toISOString(),
      hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
      mentions: Array.isArray(post.mentions) ? post.mentions : [],
      ownerUsername: post.ownerUsername || '',
      ownerId: post.ownerId || '',
      locationName: post.locationName || undefined
    } as InstagramPost;
  } catch (error) {
    console.error('Error transforming post data:', error);
    return false;
  }
}

export async function fetchInstagramPosts(username: string): Promise<InstagramPost[]> {
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

    // Make the API request to Apify
    const apiEndpoint = `https://api.apify.com/v2/actor-tasks/stefankaralic92~instagram-scraper-task/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1`;
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "addParentData": false,
        "directUrls": [instagramUrl],
        "enhanceUserSearchWithFacebookPage": false,
        "isUserReelFeedURL": false,
        "isUserTaggedFeedURL": false,
        "resultsLimit": 5,
        "resultsType": "posts",
        "searchLimit": 1,
        "searchType": "user"
      })
    });

    if (!response.ok) {
      throw new Error(`Apify API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw response from Apify:', data);

    // Transform and validate the data
    const validPosts = Array.isArray(data) ? data.map(post => isInstagramPost(post)).filter(Boolean) : [];
    console.log('Valid posts:', validPosts);

    return validPosts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}