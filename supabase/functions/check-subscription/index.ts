import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the user from the JWT token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user?.email) {
      throw new Error('No email found')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    console.log('Checking subscription for email:', user.email)

    // Get customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    if (customers.data.length === 0) {
      console.log('No customer found')
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          priceId: null,
          canceled: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      console.log('No active subscription found')
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          priceId: null,
          canceled: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get the price ID from the subscription
    const subscription = subscriptions.data[0]
    const priceId = subscription.items.data[0].price.id
    const canceled = subscription.cancel_at_period_end

    console.log('Active subscription found with price ID:', priceId, 'canceled:', canceled)

    return new Response(
      JSON.stringify({ 
        subscribed: true,
        priceId: priceId,
        canceled: canceled
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error checking subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})