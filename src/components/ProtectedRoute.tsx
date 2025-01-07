import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          // If there's an error checking the session, clear it and redirect to auth
          await supabase.auth.signOut();
          queryClient.clear();
          setSession(null);
          return;
        }
        
        if (!currentSession) {
          setSession(null);
          return;
        }

        setSession(currentSession);
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        queryClient.clear();
        setSession(null);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // Clear local session data and query cache
        setSession(null);
        queryClient.clear();
        navigate('/auth', { replace: true });
        return;
      }
      
      if (event === 'SIGNED_IN') {
        if (currentSession) {
          setSession(currentSession);
          // If user was trying to access a specific page before signing in, redirect there
          const intendedPath = location.state?.from?.pathname || '/';
          navigate(intendedPath, { replace: true });
        }
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        if (currentSession) {
          setSession(currentSession);
          // Invalidate queries that depend on the session
          queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
        }
        return;
      }

      // For any other event, just update the session if we have one
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, navigate, location.state]);

  // Show loading state while checking session
  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect to auth page if no session
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render protected content if we have a session
  return <>{children}</>;
};