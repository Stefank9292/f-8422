import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('TikTok scraper function called with method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const apiKey = Deno.env.get('TIKTOK_APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('TIKTOK_APIFY_API_KEY is not set')
    }

    const { directUrls, maxPosts, onlyPostsNewerThan } = await req.json()
    
    const response = await fetch('https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        directUrls,
        maxResults: maxPosts,
        onlyPostsNewerThan,
        shouldDownloadVideos: false,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('API Error Response:', errorBody)
      throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`)
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify({ data }),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in tiktok-scraper function:', error)
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