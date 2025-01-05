export const APIFY_CONFIG = {
  memoryMbytes: 1024, // 1GB memory allocation
  timeoutSecs: 180,
  maxConcurrency: 1,
  proxyConfiguration: {
    useApifyProxy: true,
    apifyProxyGroups: ['RESIDENTIAL'],
  }
};

// Remove hardcoded API key, we'll use the one from Supabase
export const APIFY_BASE_ENDPOINT = 'https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items';