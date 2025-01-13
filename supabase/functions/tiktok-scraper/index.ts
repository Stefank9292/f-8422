import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('TIKTOK_APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('TIKTOK_APIFY_API_KEY is not set')
    }

    const { directUrls, maxPosts, onlyPostsNewerThan } = await req.json()
    
    console.log('Processing request with params:', {
      urls: directUrls,
      maxPosts,
      onlyPostsNewerThan
    });

    if (!directUrls || !Array.isArray(directUrls) || directUrls.length === 0) {
      throw new Error('No valid URLs provided')
    }

    // Prepare request body according to Apify API structure
    const requestBody = {
      dateRange: onlyPostsNewerThan ? "CUSTOM" : "DEFAULT",
      location: "US",
      maxItems: maxPosts || 1000,
      startUrls: directUrls.map((url: string) => {
        // Handle both username and full URL formats
        if (!url.startsWith('https://')) {
          const username = url.replace('@', '').trim()
          return `https://www.tiktok.com/@${username}`
        }
        return url.trim()
      })
    }

    console.log('Making request to Apify API with body:', {
      ...requestBody,
      maxItems: requestBody.maxItems,
      urlCount: requestBody.startUrls.length
    });

    // Set timeout for fetch request
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 29000) // 29s timeout (Edge functions have 30s limit)

    try {
      const response = await fetch('https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Apify API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorText}`)
      }

      const data = await response.json()
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid response format from Apify:', data)
        throw new Error('Invalid response format from Apify API')
      }
      
      console.log('Successfully received response from Apify:', {
        dataLength: data.length,
        firstItem: data[0] ? {
          ...data[0],
          caption: data[0].caption?.substring(0, 50) + '...' // Truncate for logging
        } : null
      });

      return new Response(
        JSON.stringify({ data }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (fetchError) {
      clearTimeout(timeout)
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout: The Apify API took too long to respond')
      }
      throw fetchError
    }
  } catch (error) {
    console.error('Error in TikTok scraper:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})