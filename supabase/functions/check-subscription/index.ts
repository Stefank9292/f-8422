import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const createErrorResponse = (error: string, status = 401) => {
  return new Response(
    JSON.stringify({
      error,
      subscribed: false,
      priceId: null,
      canceled: false,
      maxClicks: 3
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  )
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log('Starting subscription check...');
    
    // Validate auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return createErrorResponse('Missing authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('Invalid authorization header format');
      return createErrorResponse('Invalid authorization header format');
    }

    const token = authHeader.split(' ')[1];

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify user
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(token);
    
    if (verifyError) {
      console.error('Token verification failed:', verifyError);
      return createErrorResponse('Invalid user session');
    }

    if (!user) {
      console.error('No user found for token');
      return createErrorResponse('User not found');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Search for customer by email
    const { data: customers, error: searchError } = await stripe.customers.search({
      query: `email:'${user.email}'`,
    });

    if (searchError) {
      console.error('Stripe customer search error:', searchError);
      throw searchError;
    }

    if (!customers || customers.length === 0) {
      console.log('No Stripe customer found, returning free tier values');
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const customer = customers[0];
    console.log('Found Stripe customer:', customer.id);

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.default_payment_method', 'data.items.data.price'],
    });

    if (!subscriptions.data.length) {
      console.log('No active subscriptions found');
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;

    // Validate price ID
    const validPriceIds = [
      "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
      "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
      "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
      "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
    ];

    if (!validPriceIds.includes(priceId)) {
      console.error('Invalid price ID found:', priceId);
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Log subscription check
    await supabaseAdmin.from('subscription_logs').insert({
      user_id: user.id,
      event: 'subscription_check',
      status: 'active',
      details: {
        subscription_id: subscription.id,
        price_id: priceId,
        customer_id: customer.id,
        cancel_at_period_end: subscription.cancel_at_period_end
      }
    });

    return new Response(
      JSON.stringify({
        subscribed: true,
        priceId: priceId,
        canceled: subscription.cancel_at_period_end,
        maxClicks: priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                  priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk" ? Infinity : 25
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Subscription check error:', error);
    return createErrorResponse(error.message, error.status || 400);
  }
});