import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscription(session: any) {
  return useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        console.log('No session token available');
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        };
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) {
          console.error('Subscription check error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Subscription check error:', error);
        // Return default free tier values on error
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        };
      }
    },
    enabled: !!session?.access_token,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}