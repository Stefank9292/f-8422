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
  locationName?: string; // Keep this optional in the interface
}

function isInstagramPost(obj: unknown): obj is InstagramPost {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  const post = obj as Record<string, unknown>;
  return (
    typeof post.url === 'string' &&
    typeof post.caption === 'string' &&
    typeof post.likesCount === 'number' &&
    typeof post.commentsCount === 'number' &&
    typeof post.viewsCount === 'number' &&
    typeof post.playsCount === 'number' &&
    typeof post.duration === 'string' &&
    typeof post.engagement === 'string' &&
    typeof post.date === 'string' &&
    typeof post.type === 'string' &&
    typeof post.timestamp === 'string' &&
    Array.isArray(post.hashtags) &&
    Array.isArray(post.mentions) &&
    typeof post.ownerUsername === 'string' &&
    typeof post.ownerId === 'string' &&
    (post.locationName === undefined || typeof post.locationName === 'string') // Updated type check for optional locationName
  );
}

export async function fetchInstagramPosts(username: string): Promise<InstagramPost[]> {
  try {
    console.log('Fetching Instagram posts for:', username);
    
    // Clean up username (remove @ if present and any spaces)
    const cleanUsername = username.replace('@', '').trim();
    
    // Construct proper Instagram URL
    const instagramUrl = `https://www.instagram.com/${cleanUsername}`;
    console.log('Using Instagram URL:', instagramUrl);

    // Mock response for development - using the constructed URL and expanded data structure
    const mockPosts = [
      {
        url: `${instagramUrl}/p/mock1`,
        caption: '15 years later, we are Still underestimating the huge...',
        likesCount: 8025,
        commentsCount: 157,
        viewsCount: 82668,
        playsCount: 311799,
        duration: '0:45',
        engagement: '9.90%',
        date: '3.1.2025',
        type: 'Video',
        timestamp: '2025-01-03T12:00:00Z',
        hashtags: ['#viral', '#trending'],
        mentions: ['@user1', '@user2'],
        ownerUsername: cleanUsername,
        ownerId: '12345',
        locationName: 'New York, NY'
      },
      {
        url: `${instagramUrl}/p/mock2`,
        caption: 'On this first day of the year can you pls send this to...',
        likesCount: 23656,
        commentsCount: 665,
        viewsCount: 242523,
        playsCount: 741145,
        duration: '0:31',
        engagement: '10.03%',
        date: '1.1.2025',
        type: 'Video',
        timestamp: '2025-01-01T00:00:00Z',
        hashtags: ['#newyear', '#2025'],
        mentions: ['@user3'],
        ownerUsername: cleanUsername,
        ownerId: '12345',
        locationName: 'Los Angeles, CA'
      },
      {
        url: `${instagramUrl}/p/mock3`,
        caption: 'Beyond ready to give more than ever .... Happy new...',
        likesCount: 14585,
        commentsCount: 290,
        viewsCount: 119635,
        playsCount: 529882,
        duration: '0:15',
        engagement: '12.43%',
        date: '1.1.2025',
        type: 'Video',
        timestamp: '2025-01-01T06:00:00Z',
        hashtags: ['#motivation', '#success'],
        mentions: [],
        ownerUsername: cleanUsername,
        ownerId: '12345'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Raw items:', mockPosts);

    // Validate and transform the data
    const validPosts = mockPosts.filter((item): item is InstagramPost => {
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