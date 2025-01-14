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

  // Check if the route requires Creator Pro subscription
  const isCreatorProRoute = ['/tiktok', '/history', '/transcribe'].includes(location.pathname);
  const hasCreatorProAccess = subscriptionStatus?.priceId && [
    "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
    "price_1QfKMYGX13ZRG2XioPYKCe7h", // Creator Pro Annual
    "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
    "price_1Qdt5HGX13ZRG2XiUW80k3Fk"  // Creator on Steroids Annual
  ].includes(subscriptionStatus.priceId);

  console.log('Subscription status:', subscriptionStatus);
  console.log('Has active subscription:', hasActiveSubscription);
  console.log('Current price ID:', subscriptionStatus?.priceId);
  console.log('Is Creator Pro route:', isCreatorProRoute);
  console.log('Has Creator Pro access:', hasCreatorProAccess);

  // If no active subscription and not on subscribe page, redirect to subscribe
  if (!hasActiveSubscription) {
    console.log('No active subscription found, redirecting to subscribe page');
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  // If trying to access a Creator Pro route without proper subscription, redirect to subscribe
  if (isCreatorProRoute && !hasCreatorProAccess) {
    console.log('Attempting to access Creator Pro feature without proper subscription');
    toast({
      title: "Creator Pro Required",
      description: "This feature requires a Creator Pro subscription or higher.",
      variant: "destructive",
    });
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};