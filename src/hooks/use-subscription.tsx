import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export function useSubscription(session: Session | null) {
  return useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        console.log("No session available, redirecting to subscribe");
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 0
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
          if (error.message.includes('Invalid user session')) {
            return {
              subscribed: false,
              priceId: null,
              canceled: false,
              maxClicks: 0
            };
          }
          throw error;
        }

        console.log("Subscription check response:", data);
        return data;
      } catch (error) {
        console.error('Subscription check error:', error);
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 0
        };
      }
    },
    enabled: !!session?.access_token,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Invalid user session')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
  });
}