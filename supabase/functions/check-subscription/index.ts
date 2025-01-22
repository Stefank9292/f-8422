import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No auth header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseKey || !stripeKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error('User error:', userError);
      throw new Error('Invalid user session');
    }

    console.log('Checking subscription for user:', user.email);

    // Get customer ID from Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      console.log('No Stripe customer found for user:', user.email);
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxRequests: 3
        }),
        { headers: corsHeaders }
      );
    }

    const customerId = customers.data[0].id;
    console.log('Found Stripe customer:', customerId);

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      console.log('No active subscriptions found for customer:', customerId);
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxRequests: 3
        }),
        { headers: corsHeaders }
      );
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    console.log('Found active subscription with price ID:', priceId);

    // Creator on Steroids Plans
    const creatorOnSteroidsPlans = [
      'price_1Qdt4NGX13ZRG2XiMWXryAm9', // Monthly
      'price_1Qdt5HGX13ZRG2XiUW80k3Fk'  // Annual
    ];

    // Creator Pro Plans
    const creatorProPlans = [
      'price_1QfKMGGX13ZRG2XiFyskXyJo', // Monthly
      'price_1QfKMYGX13ZRG2XioPYKCe7h'  // Annual
    ];

    let maxRequests;
    let subscriptionTier;

    if (creatorOnSteroidsPlans.includes(priceId)) {
      maxRequests = Infinity;
      subscriptionTier = 'steroids';
      console.log('User has Creator on Steroids plan');
    } else if (creatorProPlans.includes(priceId)) {
      maxRequests = 25;
      subscriptionTier = 'pro';
      console.log('User has Creator Pro plan');
    } else {
      maxRequests = 3;
      subscriptionTier = 'free';
      console.log('User has Free plan');
    }

    const response = {
      subscribed: true,
      priceId,
      canceled: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at,
      maxRequests,
      subscriptionTier,
      stripeSubscriptionId: subscription.id
    };

    console.log('Returning subscription details:', response);

    return new Response(
      JSON.stringify(response),
      { headers: corsHeaders }
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
        headers: corsHeaders
      }
    );
  }
});