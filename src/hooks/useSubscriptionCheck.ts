import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SubscriptionStatus {
  subscribed: boolean;
  priceId: string | null;
  canceled: boolean;
  maxClicks: number;
}

export const useSubscriptionCheck = (session: Session | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async (): Promise<SubscriptionStatus> => {
      if (!session?.access_token) {
        console.log('No session token available for subscription check');
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        };
      }
      
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }

        if (!currentSession) {
          console.log('No active session, redirecting to auth...');
          await supabase.auth.signOut();
          queryClient.clear();
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          return {
            subscribed: false,
            priceId: null,
            canceled: false,
            maxClicks: 3
          };
        }

        console.log('Using session token for subscription check:', currentSession.access_token);
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          if (error.status === 401) {
            await supabase.auth.signOut();
            queryClient.clear();
            toast({
              title: "Session Expired",
              description: "Please sign in again to continue.",
              variant: "destructive",
            });
          }
          throw error;
        }

        console.log('Subscription status received:', data);
        return data;
      } catch (error) {
        console.error('Error checking subscription:', error);
        queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
        throw error;
      }
    },
    enabled: !!session?.access_token,
    staleTime: 1000 * 60,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.message?.includes('Invalid user session')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000
  });
};