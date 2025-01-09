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
          state: { from: location }
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out properly");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authListener: any;
    let sessionCheckTimeout: NodeJS.Timeout;

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

        // Only refresh if the session is close to expiring
        const expiresAt = new Date((currentSession.expires_at || 0) * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

        if (timeUntilExpiry < REFRESH_THRESHOLD) {
          const { data: refreshResult, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            if (mounted) {
              await handleSignOut();
            }
            return;
          }

          if (mounted && refreshResult.session) {
            setSession(refreshResult.session);
          }
        } else {
          if (mounted) {
            setSession(currentSession);
          }
        }
      } catch (error) {
        console.error("Session error:", error);
        if (mounted) {
          setError("Session validation failed");
          await handleSignOut();
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Set a timeout for the initial session check
    sessionCheckTimeout = setTimeout(checkSession, 0);

    // Set up auth state change listener
    authListener = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setSession(null);
          queryClient.clear();
          if (location.pathname !== '/auth') {
            navigate('/auth', { replace: true });
          }
        }
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentSession && mounted) {
          setSession(currentSession);
          setError(null);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(sessionCheckTimeout);
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [queryClient, navigate, location]);

  return { session, isLoading, error };
};