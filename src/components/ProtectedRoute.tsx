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
      if (error?.toString().includes('refresh_token_not_found') || 
          error?.toString().includes('Invalid user session')) {
        console.log('Session error detected, signing out...', error);
        queryClient.clear();
        await supabase.auth.signOut();
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      }
    };

    if (error) {
      handleSessionError();
    }
  }, [error, toast, queryClient]);

  useEffect(() => {
    if (subscriptionError) {
      console.log('Subscription check error:', subscriptionError);
      if (subscriptionError.status === 401) {
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }
    }
  }, [subscriptionError, queryClient]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    if (error.toString().includes('refresh_token_not_found') || 
        error.toString().includes('Invalid user session')) {
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

  // Check if user has an active subscription by checking the priceId
  const hasActiveSubscription = subscriptionStatus?.priceId && [
    "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
    "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
    "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
    "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
  ].includes(subscriptionStatus.priceId);

  // Check if the current route requires Creator Pro or higher subscription
  const isRestrictedRoute = ['/tiktok', '/transcribe', '/history'].includes(location.pathname);

  // If on a restricted route and no active subscription, redirect to subscribe
  if (isRestrictedRoute && !hasActiveSubscription) {
    console.log('No active subscription found for restricted route, redirecting to subscribe page');
    toast({
      title: "Subscription Required",
      description: "This feature requires a Creator Pro subscription or higher.",
      variant: "destructive",
    });
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};