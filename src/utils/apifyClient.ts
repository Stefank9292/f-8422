import { scrapeInstagramProfile } from '@/services/instagramService';

export async function fetchInstagramPosts(
  username: string,
  numberOfVideos: number = 3,
  postsNewerThan?: Date
) {
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
  
  console.log('Using Instagram username:', cleanUsername);

  const posts = await scrapeInstagramProfile(cleanUsername, numberOfVideos, postsNewerThan);
  
  return posts.map(post => ({
    ...post,
    url: post.url || `https://www.instagram.com/p/${post.shortCode}`,
    date: new Date(post.timestamp).toLocaleDateString(),
    duration: post.videoDuration ? `${Math.floor(post.videoDuration / 60)}:${(post.videoDuration % 60).toString().padStart(2, '0')}` : '0:00',
    engagement: `${((post.likesCount + post.commentsCount) / (post.videoViewCount || post.videoPlayCount || 1)).toFixed(2)}%`
  }));
}