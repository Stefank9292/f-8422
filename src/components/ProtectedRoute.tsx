import { Navigate, useLocation } from "react-router-dom";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { LoadingState } from "@/components/auth/LoadingState";
import { ErrorState } from "@/components/auth/ErrorState";
import { UndefinedSessionState } from "@/components/auth/UndefinedSessionState";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { session, isLoading, error } = useSessionValidation();
  const queryClient = useQueryClient();

  const { data: subscriptionStatus, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
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
        console.log('Checking subscription status with token:', session.access_token.slice(0, 10) + '...');
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          // If we get an auth error, invalidate the query and return free tier values
          if (error.status === 401) {
            queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
            await supabase.auth.refreshSession();
            return {
              subscribed: false,
              priceId: null,
              canceled: false,
              maxClicks: 3
            };
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
      // Don't retry on 401 errors after session refresh attempt
      if (error?.status === 401) return false;
      return failureCount < 3;
    },
    retryDelay: 1000
  });

  if (isLoading) {
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

  // Show loading state for initial subscription check
  if (isLoadingSubscription && !subscriptionStatus) {
    return <LoadingState />;
  }

  // Check if user has an active subscription by checking the priceId
  const hasActiveSubscription = subscriptionStatus?.priceId && [
    "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
    "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
    "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
    "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
  ].includes(subscriptionStatus.priceId);

  // If no active subscription and not on subscribe page, redirect to subscribe
  if (!hasActiveSubscription) {
    console.log('No active subscription found, redirecting to subscribe page');
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};