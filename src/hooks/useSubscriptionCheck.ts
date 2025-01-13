import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

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
        // First check if session is valid
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }

        let activeSession = initialSession;

        // If no active session or session mismatch, try to refresh
        if (!activeSession || activeSession.access_token !== session.access_token) {
          console.log('Session mismatch or no active session, attempting to refresh...');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.log('Session refresh failed, signing out...');
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
          
          console.log('Session refreshed successfully');
          activeSession = refreshData.session;
          
          // Update query cache with new session
          queryClient.setQueryData(['session'], refreshData.session);
        }

        console.log('Using session token for subscription check:', activeSession.access_token.substring(0, 20) + '...');
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${activeSession.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          if (error.status === 401) {
            // Clear session and redirect to auth
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
    staleTime: 1000 * 60, // Cache for 1 minute
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.message?.includes('Invalid user session')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000
  });
};