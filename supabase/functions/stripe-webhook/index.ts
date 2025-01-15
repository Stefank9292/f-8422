import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;
        
        if (!email) {
          throw new Error('No email found for customer');
        }

        // Get user by email
        const { data: userData, error: userError } = await supabaseClient
          .from('auth.users')
          .select('id')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          throw new Error('User not found');
        }

        const userId = userData.id;
        const status = subscription.status;
        const priceId = subscription.items.data[0].price.id;
        const canceled = subscription.cancel_at_period_end;

        // Log the subscription update
        const { error: logError } = await supabaseClient
          .from('subscription_logs')
          .insert({
            user_id: userId,
            event: event.type === 'customer.subscription.deleted' ? 'subscription_cancelled' : 'subscription_updated',
            status: status === 'active' && !canceled ? 'active' : 'canceled',
            details: {
              price_id: priceId,
              stripe_subscription_id: subscription.id,
              canceled_at: subscription.canceled_at,
              cancel_at: subscription.cancel_at,
              current_period_end: subscription.current_period_end,
            }
          });

        if (logError) {
          throw logError;
        }

        console.log('Successfully processed subscription update for user:', userId);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});