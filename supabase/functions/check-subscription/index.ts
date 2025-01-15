import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No auth header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error('User error:', userError);
      throw new Error('Invalid user session');
    }

    console.log('Checking subscription for user:', user.id);

    // Get latest active subscription log
    const { data: subscriptionLogs, error: subscriptionError } = await supabase
      .from('subscription_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')  // Only get active subscriptions
      .order('created_at', { ascending: false })
      .limit(1);

    if (subscriptionError) {
      console.error('Subscription query error:', subscriptionError);
      throw subscriptionError;
    }

    console.log('Found subscription logs:', subscriptionLogs);

    let subscriptionDetails;
    const hasActiveSubscription = subscriptionLogs && subscriptionLogs.length > 0;

    if (hasActiveSubscription) {
      const latestSubscription = subscriptionLogs[0];
      let details;

      try {
        // Handle both string and object formats of details
        if (typeof latestSubscription.details === 'string') {
          details = JSON.parse(latestSubscription.details);
        } else {
          details = latestSubscription.details || {};
        }

        console.log('Parsed subscription details:', details);

        // Map price IDs to subscription tiers
        const priceId = details.price_id || details.priceId;
        let maxRequests;

        // Updated price ID mapping
        switch (priceId) {
          // Creator on Steroids Monthly
          case 'price_1Qdt4NGX13ZRG2XiMWXryAm9':
            maxRequests = Infinity;
            break;
          // Creator on Steroids Annual
          case 'price_1Qdt5HGX13ZRG2XiUW80k3Fk':
            maxRequests = Infinity;
            break;
          // Creator Pro Monthly
          case 'price_1QfKMGGX13ZRG2XiFyskXyJo':
            maxRequests = 25;
            break;
          // Creator Pro Annual
          case 'price_1QfKMYGX13ZRG2XioPYKCe7h':
            maxRequests = 25;
            break;
          default:
            maxRequests = 3; // Free tier
        }

        subscriptionDetails = {
          subscribed: true,
          priceId: priceId || null,
          canceled: details.canceled || false,
          cancel_at: details.cancel_at || null,
          maxRequests
        };

        console.log('Subscription details being returned:', subscriptionDetails);
      } catch (parseError) {
        console.error('Error parsing subscription details:', parseError);
        // Fallback to default values if parsing fails
        subscriptionDetails = {
          subscribed: true,
          priceId: null,
          canceled: false,
          cancel_at: null,
          maxRequests: 3
        };
      }
    } else {
      subscriptionDetails = {
        subscribed: false,
        priceId: null,
        canceled: false,
        cancel_at: null,
        maxRequests: 3
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
    console.error('Error in check-subscription function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: error.message.includes('Invalid user session') ? 401 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});