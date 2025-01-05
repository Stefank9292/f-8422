export const APIFY_CONFIG = {
  // Optimal memory allocation for Instagram scraping (512MB is sufficient for most cases)
  memoryMbytes: 512,
  // Timeout in seconds (2 minutes is usually enough for Instagram)
  timeoutSecs: 120,
  // Maximum concurrent requests (Instagram rate limiting consideration)
  maxConcurrency: 1,
  // Proxy configuration (optional but recommended for production)
  proxyConfiguration: {
    useApifyProxy: true,
  },
};

export const APIFY_ENDPOINTS = {
  BASE_URL: 'https://api.apify.com/v2/acts',
  INSTAGRAM_SCRAPER: 'apify~instagram-scraper/run-sync-get-dataset-items',
};

export const APIFY_API_KEY = 'apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1';