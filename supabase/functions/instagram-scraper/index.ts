import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting map using user IDs as keys
const userRequests = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Check and update rate limit for a user
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRate = userRequests.get(userId);

  if (!userRate) {
    userRequests.set(userId, { count: 1, lastReset: now });
    return true;
  }

  if (now - userRate.lastReset >= RATE_WINDOW) {
    userRequests.set(userId, { count: 1, lastReset: now });
    return true;
  }

  if (userRate.count >= RATE_LIMIT) {
    return false;
  }

  userRate.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      console.error('APIFY_API_KEY is not set');
      throw new Error('APIFY_API_KEY is not set')
    }

    // Get request body and validate
    const requestBody = await req.json()
    if (!requestBody || !requestBody.directUrls || !Array.isArray(requestBody.directUrls)) {
      console.error('Invalid request body:', requestBody);
      throw new Error('Invalid request body: directUrls array is required')
    }

    // Extract user ID from authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('Missing authorization header');
      throw new Error('Authorization header is required')
    }
    const userId = authHeader.split(' ')[1] // Basic validation, you might want to decode JWT

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          status: 429 
        }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      )
    }

    // Add user context, concurrency settings, and CLIPS filter to request
    const enhancedRequestBody = {
      ...requestBody,
      userId, // Add user ID to track requests
      maxConcurrency: 1, // Reduced concurrency to prevent timeouts
      handlePageTimeoutSecs: 60, // Increased timeout
      maxRequestRetries: 3, // Retry failed requests
      minConcurrency: 1,
      maxRequestsPerCrawl: 50, // Limit total requests
      proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      },
      productType: 'CLIPS', // Filter for CLIPS product type only
      mediaTypes: ["VIDEO", "CLIPS"], // Include CLIPS in media types
      onlyClips: true // Additional filter to ensure only CLIPS are returned
    }

    console.log('Processing request for user:', userId)
    console.log('Enhanced request configuration:', enhancedRequestBody)

    const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${apiKey}`
    
    // Make request to Apify with enhanced configuration and timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedRequestBody),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text()
        console.error('API Error Response:', errorBody)
        
        if (response.status === 402) {
          throw new Error('Instagram data fetch failed: Usage quota exceeded')
        }
        
        throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`)
      }

      const data = await response.json()
      console.log('Successfully fetched data from Apify for user:', userId)

      // Additional filter to ensure only CLIPS are returned
      const filteredData = Array.isArray(data) 
        ? data.filter(item => item.productType === 'CLIPS' || item.type === 'CLIPS')
        : [];

      return new Response(
        JSON.stringify(filteredData),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.error('Error in instagram-scraper function:', error)
    
    // Determine appropriate status code
    let statusCode = 500
    if (error.message.includes('Rate limit exceeded')) {
      statusCode = 429
    } else if (error.message.includes('Authorization')) {
      statusCode = 401
    } else if (error.message.includes('Invalid request')) {
      statusCode = 400
    } else if (error.name === 'AbortError') {
      statusCode = 504
      error.message = 'Request timeout exceeded'
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: statusCode
      }),
      { 
        status: statusCode,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})