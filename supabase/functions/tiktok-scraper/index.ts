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
      onlyPostsNewerThan,
      apiKeyLength: apiKey.length
    });

    // Prepare request body according to Apify API structure
    const requestBody = {
      dateRange: onlyPostsNewerThan ? "CUSTOM" : "DEFAULT",
      location: "US",
      maxItems: maxPosts || 1000,
      startUrls: directUrls.map((url: string) => {
        // Ensure URL is properly formatted
        if (!url.startsWith('https://')) {
          return `https://www.tiktok.com/@${url.replace('@', '')}`
        }
        return url
      })
    }

    console.log('Making request to Apify API with body:', {
      ...requestBody,
      maxItems: requestBody.maxItems,
      urlCount: requestBody.startUrls.length
    });
    
    const response = await fetch('https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

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