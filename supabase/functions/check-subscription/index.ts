import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from the JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user session');
    }

    console.log('Checking subscription for user:', user.email);

    // Get the latest active subscription log for the user
    const { data: subscriptionLogs, error: subError } = await supabaseClient
      .from('subscription_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (subError) {
      console.error('Error fetching subscription:', subError);
      throw subError;
    }

    console.log('Found subscription logs:', subscriptionLogs);

    // Check if user has an active subscription
    const hasActiveSubscription = subscriptionLogs && subscriptionLogs.length > 0;
    let subscriptionDetails;

    if (hasActiveSubscription) {
      const latestSubscription = subscriptionLogs[0];
      const details = latestSubscription.details || {};
      
      // Extract priceId from details, ensuring it's properly typed
      const priceId = typeof details === 'string' ? 
        JSON.parse(details).priceId : 
        details.priceId;

      subscriptionDetails = {
        subscribed: true,
        priceId: priceId || null,
        canceled: latestSubscription.details?.canceled || false,
        cancel_at: latestSubscription.details?.cancel_at || null
      };

      console.log('Returning subscription details:', subscriptionDetails);
    } else {
      subscriptionDetails = {
        subscribed: false,
        priceId: null,
        canceled: false,
        cancel_at: null
      };

      console.log('No active subscription found, returning:', subscriptionDetails);
    }

    return new Response(
      JSON.stringify(subscriptionDetails),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});