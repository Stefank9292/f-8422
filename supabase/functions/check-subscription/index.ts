import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { stripe } from "../_shared/stripe.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('Check subscription function called with method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Auth header found:', authHeader.substring(0, 20) + '...');

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: { 
          headers: { Authorization: authHeader } 
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Get the user from the auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error('User verification error:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid user session', 
          details: userError.message,
          code: 'AUTH_ERROR'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!user) {
      console.error('No user found in session');
      return new Response(
        JSON.stringify({ 
          error: 'No user found in session',
          code: 'NO_USER'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verified user:', user.id);

    // Get user's email
    const userEmail = user.email;
    if (!userEmail) {
      console.error('No email found for user');
      return new Response(
        JSON.stringify({ 
          error: 'User email not found',
          code: 'NO_EMAIL'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    // If no customer found, return free tier status
    if (customers.data.length === 0) {
      console.log('No Stripe customer found for email:', userEmail);
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customer = customers.data[0];
    console.log('Found Stripe customer:', customer.id);

    // Get all active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.items.data.price']
    });

    // If no active subscriptions, return free tier status
    if (subscriptions.data.length === 0) {
      console.log('No active subscriptions found for customer:', customer.id);
      return new Response(
        JSON.stringify({
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the most recent active subscription
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;

    console.log('Found active subscription:', {
      id: subscription.id,
      priceId: priceId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });

    // Return subscription status with CORS headers
    return new Response(
      JSON.stringify({
        subscribed: true,
        priceId: priceId,
        canceled: subscription.cancel_at_period_end,
        status: subscription.status
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack,
        code: 'INTERNAL_ERROR'
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
});