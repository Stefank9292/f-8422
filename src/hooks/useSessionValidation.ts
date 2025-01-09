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

      // Verify the refreshed session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("Invalid session after refresh:", userError);
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
      subscription.unsubscribe();
    };
  }, [queryClient, navigate, location, toast]);

  return { session, isLoading, error };
};