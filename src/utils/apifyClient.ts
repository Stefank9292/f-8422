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

    // Using a mock response for development - replace with actual API call
    const mockPosts = [
      {
        url: `https://www.instagram.com/${username}/p/mock1`,
        caption: 'Test post 1',
        likesCount: 100,
        commentsCount: 10
      },
      {
        url: `https://www.instagram.com/${username}/p/mock2`,
        caption: 'Test post 2',
        likesCount: 200,
        commentsCount: 20
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