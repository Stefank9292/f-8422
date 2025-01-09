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
      if (!session?.access_token) return null;
      
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          if (error.message.includes('Invalid user session') || 
              error.message.includes('session_not_found')) {
            return {
              subscribed: false,
              priceId: null,
              canceled: false,
              maxClicks: 3
            };
          }
          throw error;
        }

        // Log the subscription status for debugging
        console.log('Subscription status:', data);
        return data;
      } catch (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }
    },
    enabled: !!session?.access_token,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus to catch subscription updates
    refetchInterval: 30000 // Refetch every 30 seconds to ensure subscription status is current
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