import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useSessionValidation = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      queryClient.clear();
      setSession(null);
      
      // Only navigate if we're not already on the auth page
      if (location.pathname !== '/auth') {
        navigate('/auth', { 
          replace: true,
          state: { from: location, error: "Your session has expired. Please sign in again." }
        });
      }
      
      toast({
        title: "Session Expired",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out properly");
    } finally {
      setIsLoading(false);
    }
  };

  const validateSession = async (currentSession: Session) => {
    try {
      // Always try to refresh the session first
      const { data: refreshResult, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Session refresh error:", refreshError);
        return false;
      }

      if (!refreshResult.session) {
        console.error("No session after refresh");
        return false;
      }

      // Update the session with the refreshed one
      setSession(refreshResult.session);
      return true;
    } catch (error) {
      console.error("Session validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session check error:", sessionError);
          throw sessionError;
        }
        
        if (!currentSession) {
          console.log("No active session found");
          if (mounted) setSession(null);
          return;
        }

        const isValid = await validateSession(currentSession);
        if (!isValid && mounted) {
          await handleSignOut();
          return;
        }
      } catch (error) {
        console.error("Session error:", error);
        const errorMessage = error instanceof Error ? error.message : "Session validation failed";
        if (mounted) {
          setError(errorMessage);
          await handleSignOut();
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setSession(null);
          queryClient.clear();
          // Only navigate if we're not already on the auth page
          if (location.pathname !== '/auth') {
            navigate('/auth', { replace: true });
          }
        }
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentSession && mounted) {
          const isValid = await validateSession(currentSession);
          if (!isValid) {
            await handleSignOut();
            return;
          }
          
          setError(null);
          
          if (event === 'SIGNED_IN') {
            const intendedPath = location.state?.from?.pathname || '/';
            navigate(intendedPath, { replace: true });
          }
        }
        return;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, navigate, location, toast]);

  return { session, isLoading, error };
};