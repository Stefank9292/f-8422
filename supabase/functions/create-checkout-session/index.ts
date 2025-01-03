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
    } else {
      customer_id = customers.data[0].id

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

        // If upgrading to Ultra plan, cancel the current subscription immediately
        if (priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") {
          console.log('Canceling existing subscription for upgrade to Ultra')
          await stripe.subscriptions.cancel(currentSubscription.id, {
            prorate: true
          })
        }
      }
    }

    console.log('Creating checkout session...')
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/`
    })

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