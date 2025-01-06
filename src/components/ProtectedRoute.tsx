import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          // If there's an error checking the session, clear it and redirect to auth
          await supabase.auth.signOut({ scope: 'local' });
          setSession(null);
          return;
        }
        setSession(currentSession);
      } catch (error) {
        console.error("Session check error:", error);
        setSession(null);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state change:", event);
      if (event === 'SIGNED_OUT') {
        // Clear local session data and query cache
        setSession(null);
        queryClient.clear();
        navigate('/auth', { replace: true });
      } else if (event === 'SIGNED_IN') {
        setSession(currentSession);
        // If user was trying to access a specific page before signing in, redirect there
        const intendedPath = location.state?.from?.pathname || '/';
        navigate(intendedPath, { replace: true });
      } else {
        setSession(currentSession);
      }
    });

    // Clear query cache when navigating to a new route
    const clearQueryCache = () => {
      queryClient.clear();
    };

    window.addEventListener('popstate', clearQueryCache);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', clearQueryCache);
    };
  }, [queryClient, navigate, location.state]);

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    // Save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};