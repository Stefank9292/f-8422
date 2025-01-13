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
      console.error('TIKTOK_APIFY_API_KEY is not set')
      throw new Error('TIKTOK_APIFY_API_KEY is not configured')
    }

    console.log('Starting TikTok scraper with API key:', apiKey.substring(0, 5) + '...')

    const { directUrls, maxPosts, onlyPostsNewerThan } = await req.json()
    console.log('Received request:', {
      urls: directUrls,
      maxPosts,
      onlyPostsNewerThan
    })

    if (!directUrls || !Array.isArray(directUrls) || directUrls.length === 0) {
      throw new Error('No valid URLs provided')
    }

    const requestBody = {
      startUrls: directUrls.map(url => ({ url })),
      maxItems: maxPosts || 3,
      extendOutputFunction: `($) => {
        return {
          caption: $('meta[property="og:description"]').attr('content'),
          videoUrl: $('meta[property="og:video:secure_url"]').attr('content'),
          timestamp: $('meta[property="article:published_time"]').attr('content'),
          likesCount: parseInt($('[data-e2e="like-count"]').text().replace(/[^0-9]/g, '')) || 0,
          commentsCount: parseInt($('[data-e2e="comment-count"]').text().replace(/[^0-9]/g, '')) || 0,
          viewsCount: parseInt($('[data-e2e="video-views"]').text().replace(/[^0-9]/g, '')) || 0,
          playsCount: parseInt($('[data-e2e="video-views"]').text().replace(/[^0-9]/g, '')) || 0,
          ownerUsername: $('meta[property="og:video:tag"]').attr('content'),
        }
      }`
    }

    console.log('Prepared request body:', {
      ...requestBody,
      maxItems: requestBody.maxItems,
      urlCount: requestBody.startUrls.length
    })

    // Set timeout for fetch request
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 29000) // 29s timeout (Edge functions have 30s limit)

    try {
      const response = await fetch('https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
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
          error: errorText
        })
        throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorText}`)
      }

      const data = await response.json()
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('No data returned from Apify API')
        throw new Error('No data found for the provided URLs')
      }

      console.log('Successfully fetched data:', {
        count: data.length,
        firstItem: data[0] ? {
          ...data[0],
          caption: data[0].caption?.substring(0, 50) + '...' // Truncate for logging
        } : null
      })

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
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 29 seconds')
      }
      throw error
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