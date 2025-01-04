import { supabase } from "@/integrations/supabase/client";

export async function trackInstagramRequest(userId: string) {
  if (!userId) return;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Create new record for this request
  await supabase
    .from('user_requests')
    .insert({
      user_id: userId,
      request_type: 'instagram_search',
      period_start: startOfDay.toISOString(),
      period_end: endOfDay.toISOString()
    });
}