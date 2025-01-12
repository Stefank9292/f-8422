import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Get user ID from auth context
    const userId = req.auth?.uid;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user's subscription tier
    const { data: tier, error: tierError } = await supabaseClient.rpc(
      'get_user_subscription_tier',
      { user_id: userId }
    );

    if (tierError) {
      console.error('Error getting subscription tier:', tierError);
      throw tierError;
    }

    // Get user's request count for today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const { count, error: countError } = await supabaseClient
      .from('user_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('request_type', 'transcription')
      .gte('created_at', startOfDay.toISOString())
      .lt('created_at', endOfDay.toISOString());

    if (countError) {
      console.error('Error getting request count:', countError);
      throw countError;
    }

    // Define limits based on tier
    const limits = {
      free: 5,
      premium: 50,
      ultra: 200
    };

    const currentCount = count || 0;
    const tierLimit = limits[tier as keyof typeof limits] || limits.free;
    const canMakeRequest = currentCount < tierLimit;

    return new Response(
      JSON.stringify({
        canMakeRequest,
        currentCount,
        limit: tierLimit,
        tier
      }),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in check-subscription function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});