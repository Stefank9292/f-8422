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
      await supabase.auth.signOut();
      queryClient.clear();
      setSession(null);
      navigate('/auth', { 
        replace: true,
        state: { from: location, error: "Your session has expired. Please sign in again." }
      });
      
      toast({
        title: "Session Expired",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out properly");
    }
  };

  const validateSession = async (currentSession: Session) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(
        currentSession.access_token
      );
      
      if (userError || !user) {
        console.error("Invalid session token");
        throw new Error("Invalid session token");
      }

      return true;
    } catch (error) {
      if (error instanceof Error && 
          (error.message.includes('session_not_found') || 
           error.message.includes('Invalid session token'))) {
        console.error("Session validation failed");
        return false;
      }
      throw error;
    }
  };

  const refreshSessionIfNeeded = async (currentSession: Session) => {
    const expiresAt = currentSession.expires_at;
    if (!expiresAt) return currentSession;

    const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
    if (expiresIn >= 600) return currentSession; // More than 10 minutes until expiration

    console.log("Refreshing session...");
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
      
    if (refreshError) {
      if (refreshError.message.includes('refresh_token_not_found')) {
        console.error("Refresh token not found");
        return null;
      }
      throw refreshError;
    }
    
    return refreshedSession;
  };

  useEffect(() => {
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
          setSession(null);
          return;
        }

        const isValid = await validateSession(currentSession);
        if (!isValid) {
          await handleSignOut();
          return;
        }

        const refreshedSession = await refreshSessionIfNeeded(currentSession);
        if (!refreshedSession) {
          await handleSignOut();
          return;
        }

        console.log("Setting valid session");
        setSession(refreshedSession);
      } catch (error) {
        console.error("Session error:", error);
        const errorMessage = error instanceof Error ? error.message : "Session validation failed";
        setError(errorMessage);
        await handleSignOut();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        queryClient.clear();
        navigate('/auth', { replace: true });
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentSession) {
          setSession(currentSession);
          setError(null);
          
          if (event === 'SIGNED_IN') {
            const intendedPath = location.state?.from?.pathname || '/';
            navigate(intendedPath, { replace: true });
          }
        }
        return;
      }

      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, navigate, location, toast]);

  return { session, isLoading, error };
};