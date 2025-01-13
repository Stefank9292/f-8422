import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, numberOfVideos, dateRange, location } = await req.json()
    console.log('Processing request for:', { username, numberOfVideos, dateRange, location })

    if (!username) {
      throw new Error('No username provided')
    }

    const apiKey = Deno.env.get('TIKTOK_APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('Apify API key not configured')
    }

    // Format username to profile URL if needed
    const formattedUrl = username.startsWith('http') 
      ? username 
      : `https://www.tiktok.com/@${username.replace('@', '')}`

    const requestBody = {
      "profiles": [formattedUrl],
      "resultsPerProfile": numberOfVideos || 3,
      "dateRange": dateRange || "DEFAULT",
      "location": location || "US"
    }

    console.log('Sending request to Apify:', requestBody)

    const response = await fetch('https://api.apify.com/v2/acts/apidojo~tiktok-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Apify API error:', error)
      throw new Error(`Apify API error: ${error}`)
    }

    const posts = await response.json()
    console.log(`Retrieved ${posts.length} posts from Apify`)

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      shortcode: post.webVideoUrl,
      caption: post.description,
      timestamp: post.createTime,
      date: new Date(post.createTime).toISOString(),
      dimensions: {
        height: post.videoMeta?.height || 0,
        width: post.videoMeta?.width || 0
      },
      displayUrl: post.videoUrl,
      videoUrl: post.videoUrl,
      playsCount: post.playCount || 0,
      viewsCount: post.playCount || 0,
      likesCount: post.diggCount || 0,
      commentsCount: post.commentCount || 0,
      sharesCount: post.shareCount || 0,
      ownerUsername: username.replace('@', ''),
      engagement: ((post.diggCount || 0) + (post.commentCount || 0) + (post.shareCount || 0)) / (post.playCount || 1) * 100,
      url: post.webVideoUrl,
      duration: post.duration || 0
    }))

    return new Response(
      JSON.stringify(formattedPosts),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in tiktok-scraper:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      },
    )
  }
})