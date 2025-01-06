import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      console.error('APIFY_API_KEY is not set')
      throw new Error('APIFY_API_KEY is not set')
    }

    // Get request body
    const requestBody = await req.json()
    console.log('Processing request:', JSON.stringify(requestBody, null, 2))

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
      console.error('Apify API Error Response:', errorBody)
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Instagram data fetch failed: Usage quota exceeded' }),
          { 
            status: 402,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        )
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
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in instagram-scraper function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
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