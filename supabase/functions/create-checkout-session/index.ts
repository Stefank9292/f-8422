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

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user
    const email = user?.email

    if (!email) {
      throw new Error('No email found')
    }

    const { priceId } = await req.json();
    if (!priceId) {
      throw new Error('No price ID provided')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    console.log('Looking up customer with email:', email)
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    })

    let customer_id = undefined
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id
      // check if already subscribed
      const subscriptions = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        status: 'active',
        limit: 1
      })

      if (subscriptions.data.length > 0) {
        const currentSubscription = subscriptions.data[0];
        const currentPriceId = currentSubscription.items.data[0].price.id;

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

        // Create a checkout session for upgrade/downgrade
        console.log('Creating checkout session for plan change...')
        const session = await stripe.checkout.sessions.create({
          customer: customer_id,
          mode: 'subscription',
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${req.headers.get('origin')}/`,
          cancel_url: `${req.headers.get('origin')}/`,
          subscription_behavior: 'create_new_subscription_and_cancel_existing',
        })

        return new Response(
          JSON.stringify({ url: session.url }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }
    }

    console.log('Creating payment session for new subscription...')
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/`,
    })

    console.log('Payment session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating payment session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})