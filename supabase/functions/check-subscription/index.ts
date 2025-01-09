import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting subscription check...');
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    )

    // Get user
    console.log('Getting user session...');
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('User session error:', userError);
      throw new Error('Invalid user session')
    }

    console.log('User found:', user.id);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Get customer ID
    console.log('Searching for Stripe customer...');
    const { data: customers, error: searchError } = await stripe.customers.search({
      query: `metadata['supabaseUUID']:'${user.id}'`,
    })

    if (searchError) {
      console.error('Stripe customer search error:', searchError);
      throw searchError
    }

    // If no customer found, return free tier values
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
        }
      )
    }

    const customer = customers[0]
    console.log('Found Stripe customer:', customer.id);

    // Get subscriptions
    console.log('Fetching subscriptions...');
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.default_payment_method'],
    })

    if (!subscriptions.data.length) {
      console.log('No active subscriptions found');
      // Log to subscription_logs
      await supabaseClient.from('subscription_logs').insert({
        user_id: user.id,
        event: 'subscription_check',
        status: 'no_subscription',
        details: { customer_id: customer.id }
      });

      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const subscription = subscriptions.data[0]
    console.log('Active subscription found:', subscription.id);

    // Log to subscription_logs
    await supabaseClient.from('subscription_logs').insert({
      user_id: user.id,
      event: 'subscription_check',
      status: 'active',
      details: {
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        customer_id: customer.id,
        cancel_at_period_end: subscription.cancel_at_period_end
      }
    });

    return new Response(
      JSON.stringify({
        subscribed: true,
        priceId: subscription.items.data[0].price.id,
        canceled: subscription.cancel_at_period_end,
        maxClicks: subscription.items.data[0].price.id.includes('ultra') ? Infinity : 25
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Subscription check error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})