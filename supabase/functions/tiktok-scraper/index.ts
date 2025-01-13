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

    // Clean up username to get just the handle
    const cleanUsername = username.replace('https://www.tiktok.com/@', '').replace('@', '')

    const requestBody = {
      startUrls: [`https://www.tiktok.com/@${cleanUsername}`],
      maxItems: numberOfVideos,
      dateRange: dateRange,
      location: location,
      customMapFunction: "(object) => { return {...object} }",
      scrapeType: "posts",
      shouldDownloadVideos: false,
      shouldDownloadCovers: false
    }

    console.log('Sending request to Apify with body:', requestBody)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Apify API error:', errorText)
      throw new Error(`Apify API error: ${errorText}`)
    }

    const data = await response.json()
    console.log('Received raw TikTok data:', data)

    // Transform the data to match our expected format
    const transformedData = data.map((post: any) => {
      // Calculate engagement rate
      const plays = post.playCount || 0
      const likes = post.diggCount || 0
      const comments = post.commentCount || 0
      const shares = post.shareCount || 0
      const engagement = plays > 0 ? ((likes + comments + shares) / plays * 100).toFixed(2) : '0'

      // Format date
      const createDate = post.createTime ? new Date(post.createTime * 1000) : new Date()
      const formattedDate = createDate.toLocaleDateString()

      return {
        ownerUsername: post.authorMeta?.name || cleanUsername,
        caption: post.text || post.desc || '',
        date: formattedDate,
        timestamp: post.createTimeISO || createDate.toISOString(),
        playsCount: plays,
        viewsCount: plays, // TikTok uses playCount for views
        likesCount: likes,
        commentsCount: comments,
        sharesCount: shares,
        engagement: engagement,
        url: post.webVideoUrl || `https://www.tiktok.com/@${cleanUsername}/video/${post.id}`,
        videoUrl: post.videoUrl || post.downloadAddr || '',
        thumbnailUrl: post.covers?.[0] || post.dynamicCover || '',
        type: 'video'
      }
    })

    console.log('Transformed TikTok data:', transformedData)

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