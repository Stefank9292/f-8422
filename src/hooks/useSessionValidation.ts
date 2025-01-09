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

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      if (!mounted) return;
      
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
          if (mounted) {
            setSession(null);
          }
          return;
        }

        if (mounted) {
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Session error:", error);
        const errorMessage = error instanceof Error ? error.message : "Session validation failed";
        if (mounted) {
          setError(errorMessage);
          await handleSignOut();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        queryClient.clear();
        if (location.pathname !== '/auth') {
          navigate('/auth', { replace: true });
        }
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
      }
    });

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Remove dependencies to prevent unnecessary re-renders

  return { session, isLoading, error };
};