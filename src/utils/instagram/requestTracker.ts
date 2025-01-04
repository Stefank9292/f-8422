import { supabase } from "@/integrations/supabase/client";

export async function trackInstagramRequest(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    const { error } = await supabase
      .from('user_requests')
      .insert({
        user_id: userId,
        request_type: 'instagram_search',
        period_start: startOfDay.toISOString(),
        period_end: endOfDay.toISOString()
      });

    if (error) {
      console.error('Error tracking request:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to track request:', error);
    throw error;
  }
}

export async function checkRequestLimit(userId: string): Promise<boolean> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // Get current request count
    const { data: requests, error: countError } = await supabase
      .from('user_requests')
      .select('*')
      .eq('user_id', userId)
      .gte('period_start', startOfDay.toISOString())
      .lt('period_end', endOfDay.toISOString());

    if (countError) throw countError;

    // Get user's subscription status
    const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke(
      'check-subscription',
      {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      }
    );

    if (subscriptionError) throw subscriptionError;

    const maxRequests = subscriptionData?.maxClicks || 3; // Default to free tier limit
    const currentRequests = requests?.length || 0;

    return currentRequests < maxRequests;
  } catch (error) {
    console.error('Error checking request limit:', error);
    throw error;
  }
}