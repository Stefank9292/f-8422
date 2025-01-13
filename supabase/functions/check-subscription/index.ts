import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header found');
      return new Response(
        JSON.stringify({ 
          error: 'No authorization header',
          message: 'Please provide a valid authorization token'
        }),
        { 
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log('Processing request with auth token:', authHeader.substring(0, 20) + '...');

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ 
          error: authError?.message || 'Invalid or expired token',
          details: authError?.message,
          message: 'Please sign in again'
        }),
        { 
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log('Authenticated user:', user.id);

    // Get subscription status from subscription_logs table
    const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
      .from('subscription_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch subscription data',
          details: subscriptionError.message,
          message: 'Unable to verify subscription status'
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const isSubscribed = subscriptionData?.status === 'active';
    const priceId = subscriptionData?.details?.price_id;
    const canceled = subscriptionData?.status === 'canceled';

    console.log('Subscription status:', {
      subscribed: isSubscribed,
      priceId,
      canceled
    });

    return new Response(
      JSON.stringify({
        subscribed: isSubscribed,
        priceId,
        canceled,
        maxClicks: isSubscribed ? 25 : 3
      }),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in check-subscription function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined,
        message: 'An error occurred while checking subscription status'
      }),
      { 
        status: error instanceof Error && error.message.includes('Unauthorized') ? 401 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});