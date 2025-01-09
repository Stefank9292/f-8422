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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Auth session missing!')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user?.email) {
      console.error('Auth error:', userError)
      throw new Error('Invalid user session')
    }

    console.log('Checking subscription for user:', user.email)

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    if (customers.data.length === 0) {
      console.log('No customer found for email:', user.email)
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      expand: ['data.default_payment_method'],
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      console.log('No active subscription found for customer:', customers.data[0].id)
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const subscription = subscriptions.data[0]
    const priceId = subscription.items.data[0].price.id

    console.log('Found active subscription:', {
      priceId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    })

    return new Response(
      JSON.stringify({
        subscribed: true,
        priceId: priceId,
        canceled: subscription.cancel_at_period_end,
        maxClicks: priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || 
                  priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ" ? 25 : 
                  priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                  priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk" ? Infinity : 3
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Subscription check error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error instanceof Error && 
          (error.message === 'Auth session missing!' || error.message === 'Invalid user session') 
          ? 401 : 500,
      }
    )
  }
})