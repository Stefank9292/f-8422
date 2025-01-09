export const extractUsername = (url: string): string => {
  try {
    const username = url.split('instagram.com/')[1]?.split('/')[0];
    return username ? username.replace('@', '') : url;
  } catch {
    return url;
  }
};