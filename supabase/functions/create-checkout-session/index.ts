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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting checkout session creation...');

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from the JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }

    if (!user) {
      console.error('No user found')
      throw new Error('No user found')
    }

    if (!user.email) {
      console.error('No email found for user:', user.id)
      throw new Error('No email found')
    }

    const { priceId } = await req.json()
    if (!priceId) {
      throw new Error('No price ID provided')
    }

    console.log('Creating checkout session for:', { email: user.email });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    let customer_id
    if (customers.data.length === 0) {
      // Create new customer if none exists
      const customer = await stripe.customers.create({
        email: user.email,
      })
      customer_id = customer.id
      console.log('Created new customer:', customer_id);
    } else {
      customer_id = customers.data[0].id
      console.log('Found existing customer:', customer_id);

      // Check for existing subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer_id,
        status: 'active',
        limit: 1
      })

      if (subscriptions.data.length > 0) {
        const currentSubscription = subscriptions.data[0]
        const currentPriceId = currentSubscription.items.data[0].price.id

        // If trying to subscribe to the same plan, return error
        if (currentPriceId === priceId) {
          return new Response(
            JSON.stringify({ error: "You are already subscribed to this plan" }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          )
        }
      }
    }

    // Get the origin from the request headers and ensure it's properly formatted
    const origin = req.headers.get('origin') || ''
    const baseUrl = origin.replace(/\/$/, '') // Remove trailing slash if present

    console.log('Creating checkout session with return URL:', baseUrl);
    
    // Create checkout session without proration settings
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe?canceled=true`,
      allow_promotion_codes: true
    })

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})