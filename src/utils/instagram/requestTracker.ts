import { supabase } from "@/integrations/supabase/client";

export async function trackInstagramRequest(userId: string, requestType: string = 'instagram_search') {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    await supabase
      .from('user_requests')
      .insert({
        user_id: userId,
        request_type: requestType,
        period_start: startOfDay.toISOString(),
        period_end: endOfDay.toISOString()
      });
  } catch (error) {
    console.error('Error tracking request:', error);
    // Don't throw the error as this is not critical for the app's functionality
  }
}