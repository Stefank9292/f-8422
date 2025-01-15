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
    // Get user ID from auth context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: authError.message }),
        { 
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!user) {
      console.error('No user found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'No user found' }),
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
    const { data: subscriptionData, error: subscriptionError } = await supabaseClient
      .from('subscription_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')  // Only get active subscriptions
      .order('created_at', { ascending: false })
      .limit(1);

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      throw subscriptionError;
    }

    const subscription = subscriptionData?.[0];
    const isSubscribed = subscription?.status === 'active';
    const priceId = subscription?.details?.price_id;
    const canceled = subscription?.status === 'canceled';

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
    
    // Determine if error is auth-related
    const isAuthError = error.message?.includes('JWT') || 
                       error.message?.includes('auth') ||
                       error.message?.includes('token');
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: isAuthError ? 401 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});