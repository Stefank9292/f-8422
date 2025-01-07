import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check with error handling
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          await handleSignOut();
          return;
        }
        
        if (!currentSession) {
          console.log("No current session found");
          setSession(null);
          return;
        }

        // Security: Check token expiration and refresh if needed
        const expiresAt = currentSession.expires_at;
        if (expiresAt) {
          const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
          console.log("Session expires in:", expiresIn, "seconds");
          
          if (expiresIn < 600) { // Less than 10 minutes until expiration
            console.log("Session needs refresh");
            const { data: { session: refreshedSession }, error: refreshError } = 
              await supabase.auth.refreshSession();
              
            if (refreshError) {
              console.error("Session refresh error:", refreshError);
              await handleSignOut();
              return;
            }
            
            if (refreshedSession) {
              console.log("Session refreshed successfully");
              setSession(refreshedSession);
              return;
            }
          }
        }

        console.log("Setting valid session");
        setSession(currentSession);
      } catch (error) {
        console.error("Unexpected session error:", error);
        await handleSignOut();
      } finally {
        setIsLoading(false);
      }
    };

    const handleSignOut = async () => {
      try {
        await supabase.auth.signOut();
        queryClient.clear();
        setSession(null);
        navigate('/auth', { replace: true });
        
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Sign out error:", error);
      }
    };

    checkSession();

    // Listen for auth state changes with enhanced security
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
          // Validate session token
          const { data: { user }, error: userError } = await supabase.auth.getUser(
            currentSession.access_token
          );
          
          if (userError || !user) {
            console.error("Invalid session token");
            await handleSignOut();
            return;
          }
          
          setSession(currentSession);
          
          if (event === 'SIGNED_IN') {
            const intendedPath = location.state?.from?.pathname || '/';
            navigate(intendedPath, { replace: true });
          }
          
          if (event === 'TOKEN_REFRESHED') {
            queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
          }
        }
        return;
      }

      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, navigate, location.state, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Show error state for unexpected session issues
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-semibold">Session Error</h1>
          <p className="text-sm text-muted-foreground">
            Unable to verify your session. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Redirect to auth page if no session
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render protected content if we have a valid session
  return <>{children}</>;
};