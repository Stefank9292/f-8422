import { InstagramPost } from "./types";

export function isInstagramPost(obj: unknown): boolean {
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

export function transformToInstagramPost(obj: unknown): InstagramPost | null {
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
      viewsCount: videoViewCount,
      playsCount: videoPlayCount,
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