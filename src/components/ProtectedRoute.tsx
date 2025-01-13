import { Navigate, useLocation } from "react-router-dom";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { LoadingState } from "@/components/auth/LoadingState";
import { ErrorState } from "@/components/auth/ErrorState";
import { UndefinedSessionState } from "@/components/auth/UndefinedSessionState";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { session, isLoading, error } = useSessionValidation();
  const queryClient = useQueryClient();
  const { data: subscriptionStatus, isLoading: isLoadingSubscription, error: subscriptionError } = useSubscriptionCheck(session);
  const { toast } = useToast();

  useEffect(() => {
    const handleSessionError = async () => {
      const sessionErrors = [
        'refresh_token_not_found',
        'Invalid user session',
        'Session from session_id claim in JWT does not exist',
        'session_not_found'
      ];

      if (error && sessionErrors.some(e => error.toString().includes(e))) {
        console.log('Session error detected, signing out...', error);
        try {
          // Clear query cache first
          queryClient.clear();
          // Then attempt to sign out
          await supabase.auth.signOut();
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
        } catch (signOutError) {
          console.error('Error during sign out:', signOutError);
          // If sign out fails, force navigation to auth page
          window.location.href = '/auth';
        }
      }
    };

    if (error) {
      handleSessionError();
    }
  }, [error, toast, queryClient]);

  useEffect(() => {
    if (subscriptionError) {
      console.log('Subscription check error:', subscriptionError);
      if (subscriptionError.status === 401 || 
          (subscriptionError.message && subscriptionError.message.includes('session'))) {
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }
    }
  }, [subscriptionError, queryClient]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    const sessionErrors = [
      'refresh_token_not_found',
      'Invalid user session',
      'Session from session_id claim in JWT does not exist',
      'session_not_found'
    ];

    if (sessionErrors.some(e => error.toString().includes(e))) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    return <ErrorState error={error.toString()} onRetry={() => window.location.reload()} />;
  }

  if (session === undefined) {
    return <UndefinedSessionState onRefresh={() => window.location.reload()} />;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (location.pathname === '/subscribe' || location.pathname === '/auth') {
    return <>{children}</>;
  }

  if (isLoadingSubscription && !subscriptionStatus) {
    return <LoadingState />;
  }

  const hasActiveSubscription = subscriptionStatus?.priceId && [
    "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
    "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
    "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
    "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
  ].includes(subscriptionStatus.priceId);

  console.log('Subscription status:', subscriptionStatus);
  console.log('Has active subscription:', hasActiveSubscription);
  console.log('Current price ID:', subscriptionStatus?.priceId);

  if (!hasActiveSubscription) {
    console.log('No active subscription found, redirecting to subscribe page');
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};