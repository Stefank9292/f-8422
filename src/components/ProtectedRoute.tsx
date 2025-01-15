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
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('refresh_token_not_found') || 
          errorMessage.includes('Invalid user session')) {
        console.log('Session error detected, cleaning up...', errorMessage);
        
        try {
          // Clear query cache first
          queryClient.clear();
          
          // Sign out from Supabase
          await supabase.auth.signOut();
          
          // Clear localStorage after signout
          localStorage.clear();
          
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
        } catch (cleanupError) {
          console.error('Error during session cleanup:', cleanupError);
          // Force clear everything as fallback
          localStorage.clear();
          queryClient.clear();
        }
      }
    };

    if (error) {
      handleSessionError();
    }
  }, [error, toast, queryClient]);

  useEffect(() => {
    if (subscriptionError) {
      console.error('Subscription check error:', subscriptionError);
      if (subscriptionError instanceof Error && 'status' in subscriptionError && (subscriptionError as any).status === 401) {
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }
    }
  }, [subscriptionError, queryClient]);

  // Invalidate subscription status on route change
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
  }, [location.pathname, queryClient]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // If we have an auth error, redirect to login
    if (errorMessage.includes('refresh_token_not_found') || 
        errorMessage.includes('Invalid user session')) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    return <ErrorState error={errorMessage} onRetry={() => window.location.reload()} />;
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

  console.log('Subscription status:', subscriptionStatus);
  console.log('Current price ID:', subscriptionStatus?.priceId);

  // Check if user has an active subscription by checking the priceId
  const hasActiveSubscription = subscriptionStatus?.priceId && [
    "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
    "price_1Qdt5HGX13ZRG2XiUW80k3Fk", // Creator on Steroids Annual
    "price_1QdtwnGX13ZRG2XihcM36r3W", // Creator Pro Monthly
    "price_1QdtxHGX13ZRG2XiUW80k3Fk"  // Creator Pro Annual
  ].includes(subscriptionStatus.priceId);

  console.log('Has active subscription:', hasActiveSubscription);

  // If no active subscription and not on subscribe page, redirect to subscribe
  if (!hasActiveSubscription) {
    console.log('No active subscription found, redirecting to subscribe page');
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};