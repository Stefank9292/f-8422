export const APIFY_CONFIG = {
  // Optimal memory allocation for Instagram scraping
  memoryMbytes: 4096, // Increased for better performance
  // Timeout in seconds (3 minutes for thorough scraping)
  timeoutSecs: 180,
  // Maximum concurrent requests (Instagram rate limiting consideration)
  maxConcurrency: 1,
  // Proxy configuration for better success rate
  proxyConfiguration: {
    useApifyProxy: true,
    groups: ['RESIDENTIAL'], // Use residential proxies for better success rate
  },
};

export const APIFY_ENDPOINTS = {
  BASE_URL: 'https://api.apify.com/v2/acts',
  INSTAGRAM_SCRAPER: 'apify~instagram-scraper/run-sync-get-dataset-items',
};

export const APIFY_API_KEY = 'apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1';