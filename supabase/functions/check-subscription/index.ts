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

    // Updated valid price IDs
    const validPriceIds = [
      "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
      "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
      "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
      "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
    ];

    // Get the latest subscription log for the user
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

    const hasActiveSubscription = subscriptionLogs && 
                                subscriptionLogs.length > 0 && 
                                subscriptionLogs[0].details?.price_id && 
                                validPriceIds.includes(subscriptionLogs[0].details.price_id);

    const subscriptionDetails = hasActiveSubscription ? {
      subscribed: true,
      priceId: subscriptionLogs[0].details.price_id,
      canceled: subscriptionLogs[0].details.canceled || false
    } : {
      subscribed: false,
      priceId: null,
      canceled: false
    };

    console.log('Returning subscription details:', subscriptionDetails);

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