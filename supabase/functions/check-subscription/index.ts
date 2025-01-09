import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';

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
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Get the user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError);
      throw new Error('Error getting user');
    }

    console.log('Checking subscription for user:', user.email);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    try {
      // Get customer by email
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      console.log('Found customers:', customers.data.length);

      if (!customers.data.length) {
        console.log('No Stripe customer found for email:', user.email);
        return new Response(
          JSON.stringify({ 
            subscribed: false,
            message: 'No Stripe customer found'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const customer = customers.data[0];
      console.log('Found Stripe customer:', customer.id);

      // Get active subscriptions for customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
      });

      console.log('Found subscriptions:', subscriptions.data.length);

      if (!subscriptions.data.length) {
        console.log('No active subscriptions found for customer:', customer.id);
        return new Response(
          JSON.stringify({ 
            subscribed: false,
            message: 'No active subscription found'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const subscription = subscriptions.data[0];
      const priceId = subscription.items.data[0].price.id;

      console.log('Found active subscription:', {
        subscriptionId: subscription.id,
        priceId: priceId,
        status: subscription.status
      });

      // Check if the price ID matches any of our plan price IDs
      const isSteroidsMonthly = priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9";
      const isSteroidsAnnual = priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
      const isProMonthly = priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu";
      const isProAnnual = priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ";

      const subscriptionDetails = {
        subscribed: true,
        priceId: priceId,
        status: subscription.status,
        canceled: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.current_period_end,
        isSteroids: isSteroidsMonthly || isSteroidsAnnual,
        isPro: isProMonthly || isProAnnual
      };

      console.log('Returning subscription details:', subscriptionDetails);

      return new Response(
        JSON.stringify(subscriptionDetails),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      throw stripeError;
    }
  } catch (error) {
    console.error('Error in check-subscription:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        message: 'Failed to check subscription status'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});