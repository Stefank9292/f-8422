import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthHeader } from "@/components/auth/AuthHeader";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [view, setView] = useState<"sign_in" | "sign_up">(
    location.pathname === "/auth/sign-up" ? "sign_up" : "sign_in"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for error in URL params
        const params = new URLSearchParams(window.location.hash.substring(1));
        const errorDescription = params.get('error_description');
        if (errorDescription) {
          console.error("Auth error from URL:", errorDescription);
          setError(errorDescription);
          // Clear the URL without triggering a refresh
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          return;
        }

        if (session) {
          console.log("Active session found, redirecting...");
          const redirectTo = location.state?.from?.pathname || "/";
          navigate(redirectTo, { replace: true });
          return;
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
      
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, location]);

  // Update URL when view changes
  useEffect(() => {
    const path = view === "sign_up" ? "/auth/sign-up" : "/auth";
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [view, navigate, location.pathname]);

  // Update view when URL changes
  useEffect(() => {
    setView(location.pathname === "/auth/sign-up" ? "sign_up" : "sign_in");
  }, [location.pathname]);

  const handleViewChange = (newView: "sign_in" | "sign_up") => {
    setView(newView);
  };

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
              loading={loading} 
              setLoading={setLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;