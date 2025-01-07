import { InstagramPost } from "@/types/instagram";
import { supabase } from "@/integrations/supabase/client";

export async function searchInstagram(username: string, numberOfVideos: number, selectedDate?: Date) {
  const { data, error } = await supabase.functions.invoke('instagram-scraper', {
    body: { username, numberOfVideos, selectedDate }
  });

  if (error) throw error;
  return data;
}