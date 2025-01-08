import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get auth user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get the site key from secrets
    const siteKey = Deno.env.get('RECAPTCHA_SITE_KEY')
    
    if (!siteKey) {
      throw new Error('RECAPTCHA_SITE_KEY not found')
    }

    return new Response(
      JSON.stringify({ siteKey }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})