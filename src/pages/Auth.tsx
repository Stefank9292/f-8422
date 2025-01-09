import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoadingState } from "@/components/auth/LoadingState";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [formLoading, setFormLoading] = useState(false);

  // Set initial view based on URL and handle session check
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Set view based on URL path
        if (mounted) {
          setView(location.pathname === "/auth/sign-up" ? "sign_up" : "sign_in");
        }

        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setError(sessionError.message);
          }
          return;
        }

        if (session) {
          console.log("Active session found, redirecting...");
          const redirectTo = location.state?.from?.pathname || "/";
          navigate(redirectTo, { replace: true });
          return;
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location]);

  // Handle view changes without URL updates
  const handleViewChange = (newView: "sign_in" | "sign_up") => {
    setView(newView);
  };

  // Show loading state only during initial session check
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader view={view} />
        
        <div className="material-card p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {view === "sign_in" ? (
            <SignInForm onViewChange={handleViewChange} />
          ) : (
            <SignUpForm 
              onViewChange={handleViewChange} 
              loading={formLoading} 
              setLoading={setFormLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;