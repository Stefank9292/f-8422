import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { ApifyClient } from 'https://esm.sh/apify-client@2.9.3'

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
    const { username, numberOfVideos = 5, selectedDate } = await req.json()
    const apifyKey = Deno.env.get('TIKTOK_APIFY_API_KEY')

    if (!apifyKey) {
      console.error('TIKTOK_APIFY_API_KEY is not set')
      throw new Error('API key not configured')
    }

    if (!username) {
      throw new Error('Username is required')
    }

    console.log(`Starting TikTok scrape for user: ${username}`)
    console.log(`Number of videos requested: ${numberOfVideos}`)
    console.log(`Selected date filter: ${selectedDate}`)

    const client = new ApifyClient({
      token: apifyKey,
    })

    // Run the TikTok scraper actor
    const run = await client.actor("clockworks/tiktok-profile-scraper").call({
      profileName: username,
      maxPosts: numberOfVideos,
      shouldDownloadCovers: false,
      shouldDownloadSlideshowImages: false,
      shouldDownloadVideos: false,
    })

    console.log('Scraper run started, waiting for results...')

    // Wait for the actor to finish and fetch the results
    const { items: posts } = await client.dataset(run.defaultDatasetId).listItems()

    console.log(`Retrieved ${posts.length} posts`)

    // Process and transform the results
    const processedResults = posts.map(post => ({
      authorUsername: post.authorMeta?.name || username,
      description: post.text || '',
      createTime: new Date(post.createTime).toLocaleDateString(),
      playCount: post.playCount || 0,
      viewCount: post.playCount || 0, // TikTok uses playCount as views
      likeCount: post.diggCount || 0,
      commentCount: post.commentCount || 0,
      engagement: ((post.diggCount + post.commentCount) / (post.playCount || 1) * 100).toFixed(2),
      webVideoUrl: post.webVideoUrl || '',
      timestamp: post.createTime,
    }))

    // Filter by date if specified
    const filteredResults = selectedDate 
      ? processedResults.filter(post => new Date(post.timestamp) >= new Date(selectedDate))
      : processedResults

    console.log(`Returning ${filteredResults.length} filtered results`)

    return new Response(
      JSON.stringify({
        status: 'success',
        data: filteredResults,
      }),
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
        status: 'error',
        message: error.message
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