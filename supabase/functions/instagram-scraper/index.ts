import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('Instagram scraper function called with method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      console.error('APIFY_API_KEY is not set');
      throw new Error('APIFY_API_KEY is not set')
    }

    const { directUrls, ...otherParams } = await req.json()
    
    // Set timeout to 10 minutes for bulk requests with more than 10 URLs
    const timeout = directUrls.length > 10 ? 600000 : 120000; // 600000ms = 10 minutes, 120000ms = 2 minutes
    console.log(`Setting timeout to ${timeout}ms for ${directUrls.length} URLs`);

    const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...otherParams,
        directUrls,
      }),
      signal: AbortSignal.timeout(timeout), // Set the timeout
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('API Error Response:', errorBody)
      
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
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in instagram-scraper function:', error)
    
    // Check if it's a timeout error
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return new Response(
        JSON.stringify({ 
          error: 'Request timed out. This may happen with large bulk requests. Please try with fewer URLs.',
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID()
        }),
        { 
          status: 408, // Request Timeout status
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

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