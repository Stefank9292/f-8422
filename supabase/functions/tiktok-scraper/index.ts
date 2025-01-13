import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ApifyClient } from 'https://esm.sh/apify-client@2.9.3'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, numberOfVideos, dateRange, location } = await req.json()
    
    const client = new ApifyClient({
      token: Deno.env.get('TIKTOK_APIFY_API_KEY'),
    })

    const requestBody = {
      customMapFunction: "(object) => { return {...object} }",
      dateRange: dateRange || "DEFAULT",
      location: location || "US",
      maxItems: numberOfVideos || 3,
      startUrls: [`https://www.tiktok.com/@${username.replace('@', '')}`]
    }

    const run = await client.actor("clockworks/tiktok-profile-scraper").call(requestBody)
    const { items: posts } = await client.dataset(run.defaultDatasetId).listItems()

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
    }))

    return new Response(
      JSON.stringify(formattedPosts),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})