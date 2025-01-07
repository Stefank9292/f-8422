export function extractUsernameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Instagram URLs typically have the username as the first path segment
    if (pathParts.length > 0) {
      return pathParts[0];
    }
    
    return null;
  } catch (e) {
    // If the URL is invalid, try to extract username from raw string
    const match = url.match(/(?:instagram\.com\/|@)([A-Za-z0-9_.](?:(?:[A-Za-z0-9_.]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/) ;
    return match ? match[1] : null;
  }
}