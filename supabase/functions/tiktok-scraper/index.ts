import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ApifyClient } from 'https://esm.sh/apify-client@2.9.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username, numberOfVideos, selectedDate, location } = await req.json()

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the user from the request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '')

    if (userError) throw userError

    // Initialize the Apify client
    const client = new ApifyClient({
      token: Deno.env.get('TIKTOK_APIFY_API_KEY'),
    })

    // Prepare the input
    const input = {
      username,
      maxPostCount: numberOfVideos || 3,
      startDate: selectedDate,
      proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyCountry: location,
      },
    }

    // Run the actor and wait for it to finish
    const run = await client.actor('clockworks/tiktok-scraper').call(input)

    // Fetch the actor's output
    const { items: results } = await client.dataset(run.defaultDatasetId).listItems()

    // Transform the results
    const transformedResults = results.map((post: any) => ({
      username: post.authorUsername,
      caption: post.caption,
      date: post.createTime,
      viewsCount: post.playCount,
      sharesCount: post.shareCount,
      likesCount: post.likeCount,
      commentsCount: post.commentCount,
      engagement: ((post.likeCount + post.commentCount + post.shareCount) / post.playCount * 100).toFixed(2) + '%',
      url: post.webVideoUrl,
      videoUrl: post.downloadUrl,
      timestamp: post.createTime,
    }))

    return new Response(
      JSON.stringify({ results: transformedResults }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})