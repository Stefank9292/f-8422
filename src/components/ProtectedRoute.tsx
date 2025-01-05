import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();

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
        // Clear local session data
        setSession(null);
      } else {
        setSession(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};