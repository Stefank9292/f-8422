import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from the JWT token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user session' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('Checking subscription for user:', user.email);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    if (customers.data.length === 0) {
      console.log('No customer found for email:', user.email);
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3 // Free plan max clicks
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      console.log('No active subscription found for customer:', customers.data[0].id);
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3 // Free plan max clicks
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get the price ID from the subscription
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    const canceled = subscription.cancel_at_period_end;

    // Determine max clicks based on the plan
    let maxClicks = 3; // Default free plan
    if (priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      maxClicks = 25; // Premium plan
    } else if (priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") {
      maxClicks = 50; // Ultra plan
    }

    console.log('Active subscription found with price ID:', priceId, 'canceled:', canceled, 'maxClicks:', maxClicks);

    return new Response(
      JSON.stringify({ 
        subscribed: true,
        priceId: priceId,
        canceled: canceled,
        maxClicks: maxClicks
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});