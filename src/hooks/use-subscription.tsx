import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export function useSubscription(session: Session | null) {
  return useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

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