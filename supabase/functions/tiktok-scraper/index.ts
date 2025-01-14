import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TikTokRequestBody {
  username: string;
  numberOfVideos?: number;
  postsNewerThan?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY')
    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY is not set')
    }

    const { username, numberOfVideos = 3, postsNewerThan } = await req.json() as TikTokRequestBody

    console.log('TikTok scraper request:', { username, numberOfVideos, postsNewerThan })

    const requestBody = {
      "username": username.replace('@', ''),
      "maxPostCount": numberOfVideos,
      "shouldDownloadCovers": false,
      "shouldDownloadSlideshowImages": false,
      "shouldDownloadVideos": false
    }

    if (postsNewerThan) {
      requestBody["postsNewerThan"] = postsNewerThan;
    }

    const response = await fetch(
      'https://api.apify.com/v2/acts/apidojo~tiktok-scraper/run-sync-get-dataset-items?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      throw new Error(`Apify API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('TikTok scraper response:', data)

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
    console.error('Error in tiktok-scraper function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
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