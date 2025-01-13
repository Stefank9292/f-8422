import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("TikTok scraper function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, numberOfVideos = 3, dateRange = 'DEFAULT', location = 'US' } = await req.json()

    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Received request with params:', {
      username,
      numberOfVideos,
      dateRange,
      location
    })

    const APIFY_API_KEY = Deno.env.get('TIKTOK_APIFY_API_KEY')
    if (!APIFY_API_KEY) {
      throw new Error('TIKTOK_APIFY_API_KEY is not configured')
    }

    const endpoint = `https://api.apify.com/v2/acts/apidojo~tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": username,
        "maxResults": numberOfVideos,
        "shouldDownloadCovers": false,
        "shouldDownloadSlideshowImages": false,
        "shouldDownloadVideos": false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Apify API error:', errorText)
      throw new Error(`Apify API error: ${errorText}`)
    }

    const data = await response.json()
    console.log('Received TikTok data:', data)

    // Transform the data to match our expected format
    const transformedData = data.map((post: any) => ({
      ownerUsername: post.authorMeta?.name || username,
      caption: post.text || '',
      date: post.createTime || '',
      timestamp: post.createTimeISO || '',
      playsCount: post.playCount || 0,
      viewsCount: post.playCount || 0, // TikTok uses playCount for views
      likesCount: post.diggCount || 0,
      commentsCount: post.commentCount || 0,
      engagement: calculateEngagement(post.playCount || 0, post.diggCount || 0, post.commentCount || 0),
      url: post.webVideoUrl || '',
      videoUrl: post.videoUrl || '',
      thumbnailUrl: post.covers?.[0] || '',
      type: 'video'
    }))

    console.log('Transformed data:', transformedData)

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})

function calculateEngagement(plays: number, likes: number, comments: number): string {
  if (plays === 0) return '0'
  const engagement = ((likes + comments) / plays) * 100
  return engagement.toFixed(2)
}