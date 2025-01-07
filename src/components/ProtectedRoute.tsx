import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

        // Validate session token
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser(
            currentSession.access_token
          );
          
          if (userError || !user) {
            console.error("Invalid session token");
            throw new Error("Invalid session token");
          }

          // Check token expiration
          const expiresAt = currentSession.expires_at;
          if (expiresAt) {
            const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
            console.log("Session expires in:", expiresIn, "seconds");
            
            if (expiresIn < 600) { // Less than 10 minutes until expiration
              console.log("Refreshing session...");
              const { data: { session: refreshedSession }, error: refreshError } = 
                await supabase.auth.refreshSession();
                
              if (refreshError) {
                if (refreshError.message.includes('refresh_token_not_found')) {
                  console.error("Refresh token not found, signing out");
                  await handleSignOut();
                  return;
                }
                throw refreshError;
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
          if (error instanceof Error && 
              (error.message.includes('session_not_found') || 
               error.message.includes('Invalid session token'))) {
            console.error("Session validation failed, signing out");
            await handleSignOut();
            return;
          }
          throw error;
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">Session Error</h1>
          <p className="text-sm text-muted-foreground">
            Unable to verify your session. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};