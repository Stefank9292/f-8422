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
    const apifyKey = Deno.env.get('APIFY_API_KEY')
    if (!apifyKey) {
      console.error('APIFY_API_KEY environment variable is not set')
      throw new Error('APIFY_API_KEY is not set')
    }

    console.log('Successfully retrieved APIFY_API_KEY')
    
    return new Response(
      JSON.stringify({ 
        key: apifyKey,
        status: 'success' 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in get-apify-key function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
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