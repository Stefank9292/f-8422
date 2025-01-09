import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header and validate it
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      console.error('User verification failed:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid user session' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (!user.email) {
      console.error('No email found for user:', user.id)
      return new Response(
        JSON.stringify({ error: 'No email associated with user account' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const { priceId } = await req.json()
    if (!priceId) {
      console.error('No price ID provided')
      return new Response(
        JSON.stringify({ error: 'No price ID provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log('Creating checkout session for:', { email: user.email, priceId })

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
        metadata: {
          supabase_user_id: user.id
        }
      })
      customer_id = customer.id
      console.log('Created new customer:', customer_id)
    } else {
      customer_id = customers.data[0].id
      console.log('Found existing customer:', customer_id)

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
              status: 200,
            }
          )
        }

        // Cancel current subscription immediately for both upgrade and downgrade
        console.log('Canceling existing subscription for upgrade/downgrade')
        await stripe.subscriptions.cancel(currentSubscription.id, {
          prorate: true
        })
      }
    }

    // Get the origin from the request headers and ensure it's properly formatted
    const origin = req.headers.get('origin') || 'https://vyral-search.com'
    const baseUrl = origin.replace(/\/$/, '') // Remove trailing slash if present

    console.log('Creating checkout session with return URL:', baseUrl)
    
    try {
      // Create the checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer_id,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/subscribe?canceled=true`,
        allow_promotion_codes: true,
      })

      console.log('Checkout session created:', session.id)

      if (!session.url) {
        throw new Error('No checkout URL returned from Stripe')
      }

      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (stripeError) {
      console.error('Stripe checkout session creation error:', stripeError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create checkout session',
          details: stripeError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})