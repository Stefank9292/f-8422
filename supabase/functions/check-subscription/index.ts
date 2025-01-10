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

const validateAuthHeader = (authHeader: string | null) => {
  if (!authHeader) {
    console.error('Missing authorization header');
    return { error: 'Missing authorization header' };
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.error('Invalid authorization header format');
    return { error: 'Invalid authorization header format' };
  }

  return { token: authHeader.split(' ')[1] };
}

const verifyUser = async (token: string) => {
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

  const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(token);
  
  if (verifyError) {
    console.error('Token verification failed:', verifyError);
    return { error: 'Invalid user session' };
  }

  if (!user) {
    console.error('No user found for token');
    return { error: 'User not found' };
  }

  return { user };
}

const getStripeSubscription = async (userEmail: string) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const { data: customers, error: searchError } = await stripe.customers.search({
    query: `email:'${userEmail}'`,
  });

  if (searchError) {
    console.error('Stripe customer search error:', searchError);
    throw searchError;
  }

  if (!customers || customers.length === 0) {
    console.log('No Stripe customer found, returning free tier values');
    return null;
  }

  const customer = customers[0];
  console.log('Found Stripe customer:', customer.id);

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    expand: ['data.default_payment_method', 'data.items.data.price'],
  });

  if (!subscriptions.data.length) {
    console.log('No active subscriptions found');
    return null;
  }

  return subscriptions.data[0];
}

const validatePriceId = (priceId: string) => {
  const validPriceIds = [
    "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
    "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
    "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
    "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
  ];
  return validPriceIds.includes(priceId);
}

serve(async (req) => {
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
    const authResult = validateAuthHeader(req.headers.get('Authorization'));
    if (authResult.error) {
      return createErrorResponse(authResult.error);
    }

    // Verify user
    const userResult = await verifyUser(authResult.token!);
    if (userResult.error) {
      return createErrorResponse(userResult.error);
    }

    // Get subscription
    const subscription = await getStripeSubscription(userResult.user.email!);
    
    if (!subscription) {
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

    const priceId = subscription.items.data[0].price.id;
    
    if (!validatePriceId(priceId)) {
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

    // Log to subscription_logs
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

    await supabaseAdmin.from('subscription_logs').insert({
      user_id: userResult.user.id,
      event: 'subscription_check',
      status: 'active',
      details: {
        subscription_id: subscription.id,
        price_id: priceId,
        customer_id: subscription.customer,
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