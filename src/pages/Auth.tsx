import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Welcome to VyralSearch
          </h1>
          <p className="text-muted-foreground">
            {view === "sign_in" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        
        <div className="material-card p-6 space-y-6">
          {view === "sign_in" ? (
            <SignInForm 
              onViewChange={setView} 
              loading={loading} 
              setLoading={setLoading} 
            />
          ) : (
            <SignUpForm 
              onViewChange={setView} 
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