import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export function useSubscription(session: Session | null) {
  return useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        console.log("No session available, returning free tier values");
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        };
      }

      try {
        console.log("Checking subscription with token:", session.access_token.slice(0, 10) + "...");
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) {
          console.error('Subscription check error:', error);
          // If we get an auth error, we'll return the free tier values
          if (error.message.includes('Invalid user session')) {
            return {
              subscribed: false,
              priceId: null,
              canceled: false,
              maxClicks: 3
            };
          }
          throw error;
        }

        console.log("Subscription check response:", data);
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
    retry: (failureCount, error) => {
      // Only retry if it's not an auth error
      if (error instanceof Error && error.message.includes('Invalid user session')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
  });
}