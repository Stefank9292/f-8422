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
      throw new Error('APIFY_API_KEY is not set')
    }

    // Get request body and validate
    const requestBody = await req.json()
    if (!requestBody || !requestBody.directUrls || !Array.isArray(requestBody.directUrls)) {
      throw new Error('Invalid request body: directUrls array is required')
    }

    // Extract user ID from authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
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

    // Add user context and concurrency settings to request
    const enhancedRequestBody = {
      ...requestBody,
      userId, // Add user ID to track requests
      maxConcurrency: 2, // Limit concurrent requests per user
      handlePageTimeoutSecs: 30, // Timeout for each page
      maxRequestRetries: 3, // Retry failed requests
      minConcurrency: 1,
      maxRequestsPerCrawl: 50, // Limit total requests
      proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      }
    }

    console.log('Processing request for user:', userId)
    console.log('Enhanced request configuration:', enhancedRequestBody)

    const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${apiKey}`
    
    // Make request to Apify with enhanced configuration
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enhancedRequestBody)
    })

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

    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Apify')
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
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