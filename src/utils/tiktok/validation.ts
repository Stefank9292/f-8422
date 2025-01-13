export const isTikTokUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('tiktok.com');
  } catch {
    return false;
  }
};

export const extractTikTokUsername = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    return pathParts[0] || '';
  } catch {
    return '';
  }
};