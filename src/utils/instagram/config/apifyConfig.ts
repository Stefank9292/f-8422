export const APIFY_CONFIG = {
  memoryMbytes: 1024, // 1GB memory allocation
  timeoutSecs: 180,
  maxConcurrency: 1,
  proxyConfiguration: {
    useApifyProxy: true,
    apifyProxyGroups: ['RESIDENTIAL'],
  }
};

export const APIFY_ENDPOINT = 'https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=apify_api_yT1CTZA7SyxHa9eRpx9lI2Fkjhj7Dr0rili1';