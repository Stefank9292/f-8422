import { Navigate, useLocation } from "react-router-dom";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { LoadingState } from "@/components/auth/LoadingState";
import { ErrorState } from "@/components/auth/ErrorState";
import { UndefinedSessionState } from "@/components/auth/UndefinedSessionState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { session, isLoading, error } = useSessionValidation();

  const { data: subscriptionStatus, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        console.log('No session token available, returning default subscription status');
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        };
      }
      
      try {
        console.log('Checking subscription with session:', {
          userId: session.user.id,
          tokenLength: session.access_token.length,
          tokenPrefix: session.access_token.slice(0, 10) + '...'
        });

        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          // If we get an auth error, return default subscription status
          if (error.message.includes('Invalid user session') || 
              error.message.includes('session_not_found') ||
              error.status === 401) {
            return {
              subscribed: false,
              priceId: null,
              canceled: false,
              maxClicks: 3
            };
          }
          throw error;
        }

        console.log('Subscription check response:', data);
        return data;
      } catch (error) {
        console.error('Error checking subscription:', error);
        // Return default subscription status on error
        return {
          subscribed: false,
          priceId: null,
          canceled: false,
          maxClicks: 3
        };
      }
    },
    enabled: !!session?.access_token,
    retry: (failureCount, error: any) => {
      // Only retry if it's not an auth error
      if (error?.message?.includes('Invalid user session') || 
          error?.message?.includes('session_not_found') ||
          error?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  // Show loading state only if we're loading the initial session
  if (isLoading || (session && isLoadingSubscription)) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Handle undefined session state
  if (session === undefined) {
    return <UndefinedSessionState onRefresh={() => window.location.reload()} />;
  }

  // If no session, redirect to auth
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If on subscribe page or auth page, allow access regardless of subscription status
  if (location.pathname === '/subscribe' || location.pathname === '/auth') {
    return <>{children}</>;
  }

  // If no subscription and not on subscribe page, redirect to subscribe
  if (!subscriptionStatus?.subscribed) {
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};