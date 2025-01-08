import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the site key from secrets
    const siteKey = Deno.env.get('RECAPTCHA_SITE_KEY')
    
    if (!siteKey) {
      console.error('RECAPTCHA_SITE_KEY not found in environment')
      throw new Error('RECAPTCHA_SITE_KEY not found')
    }

    console.log('Successfully retrieved reCAPTCHA site key')
    return new Response(
      JSON.stringify({ siteKey }),
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error in get-recaptcha-key function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: corsHeaders
      }
    )
  }
})