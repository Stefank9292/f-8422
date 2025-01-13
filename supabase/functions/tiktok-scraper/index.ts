import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ApifyClient } from 'npm:apify-client@2.9.3'

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
      console.error('TIKTOK_APIFY_API_KEY is not configured')
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

    // Initialize the ApifyClient
    const client = new ApifyClient({
      token: apiKey,
    })

    // Prepare Actor input according to the correct structure
    const input = {
      startUrls: directUrls,
      maxItems: maxPosts || 3,
      dateRange: onlyPostsNewerThan ? "CUSTOM" : "DEFAULT",
      location: "US",
      customMapFunction: "(object) => { return {...object} }",
      scrapeType: "posts",
      shouldDownloadVideos: false,
      shouldDownloadCovers: false
    }

    console.log('Prepared actor input:', {
      ...input,
      maxItems: input.maxItems,
      urlCount: input.startUrls.length
    })

    try {
      // Run the Actor and wait for it to finish
      const run = await client.actor("5K30i8aFccKNF5ICs").call(input)
      
      if (!run || !run.defaultDatasetId) {
        console.error('Invalid response from Apify actor:', run)
        throw new Error('Failed to get response from Apify actor')
      }

      // Fetch results from the dataset
      console.log('Fetching results from dataset:', run.defaultDatasetId)
      const { items } = await client.dataset(run.defaultDatasetId).listItems()

      if (!items || !Array.isArray(items)) {
        console.warn('No data returned from Apify dataset')
        throw new Error('Invalid data format received from Apify')
      }

      if (items.length === 0) {
        console.warn('No items found in dataset')
        throw new Error('No data found for the provided URLs')
      }

      console.log('Successfully fetched data:', {
        count: items.length,
        firstItem: items[0] ? {
          ...items[0],
          caption: items[0].caption?.substring(0, 50) + '...' // Truncate for logging
        } : null
      })

      return new Response(
        JSON.stringify({ data: items }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      console.error('Apify actor error:', error)
      throw new Error(`Apify actor request failed: ${error.message}`)
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