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
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    // Get request body
    const requestData = await req.json()
    const { username, numberOfVideos, postsNewerThan, action } = requestData

    // If action is 'cancel', get and stop the last run
    if (action === 'cancel') {
      const lastRunResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/last?token=${apiKey}`
      )
      
      if (!lastRunResponse.ok) {
        throw new Error('Failed to fetch last run')
      }

      const lastRun = await lastRunResponse.json()
      
      // Only stop if the run is still in progress
      if (lastRun.data.status === 'RUNNING') {
        const stopResponse = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/${lastRun.data.id}/abort`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: apiKey }),
          }
        )

        if (!stopResponse.ok) {
          throw new Error('Failed to stop run')
        }

        return new Response(
          JSON.stringify({ message: 'Search cancelled successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: 'No active search to cancel' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing request for:', { username, numberOfVideos, postsNewerThan })

    const instagramUrl = `https://www.instagram.com/${username.replace('@', '')}/`
    const requestBody = {
      "addParentData": false,
      "directUrls": [instagramUrl],
      "enhanceUserSearchWithFacebookPage": false,
      "isUserReelFeedURL": false,
      "isUserTaggedFeedURL": false,
      "resultsLimit": numberOfVideos,
      "resultsType": "posts",
      "searchLimit": 1,
      "searchType": "user",
      "memoryMbytes": 512,
      "maxPosts": numberOfVideos,
      "mediaTypes": ["VIDEO"],
      "expandVideo": true,
      "includeVideoMetadata": true
    }

    if (postsNewerThan) {
      requestBody.onlyPostsNewerThan = new Date(postsNewerThan).toISOString().split('T')[0]
    }

    const apiEndpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${apiKey}`
    
    console.log('Sending request to Apify...')
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('API Error Response:', errorBody)
      
      if (response.status === 402) {
        throw new Error('Instagram data fetch failed: Usage quota exceeded')
      }
      
      throw new Error(`Apify API request failed: ${response.statusText}\nResponse: ${errorBody}`)
    }

    const data = await response.json()
    console.log('Successfully fetched data from Apify')

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
    console.error('Error in instagram-scraper function:', error)
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