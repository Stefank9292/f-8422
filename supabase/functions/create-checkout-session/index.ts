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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user?.email) {
      throw new Error('No email found')
    }

    console.log('Creating checkout session for:', { email: user.email });

    const { priceId } = await req.json()
    if (!priceId) {
      throw new Error('No price ID provided')
    }

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
    }

    // Get the origin from the request headers and ensure it's properly formatted
    const origin = req.headers.get('origin') || ''
    const baseUrl = origin.replace(/\/$/, '') // Remove trailing slash if present

    console.log('Creating checkout session with return URL:', baseUrl);
    
    // Create the checkout session without canceling the current subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe?canceled=true`,
      allow_promotion_codes: true,
      subscription_data: {
        // This ensures proper subscription upgrade/downgrade behavior
        billing_cycle_anchor: 'now',
        proration_behavior: 'create_prorations'
      }
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