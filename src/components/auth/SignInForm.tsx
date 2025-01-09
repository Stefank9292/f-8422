import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthError } from "@supabase/supabase-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SignInFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignInForm = ({ onViewChange, loading, setLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isLocked, remainingTime, updateRateLimit } = useRateLimit({
    key: 'signin_attempts',
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  });
  const { handleAuthError, handleAuthSuccess } = useAuthForm({
    mode: 'sign_in',
    updateRateLimit
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Too many attempts",
        description: `Please try again in ${Math.ceil(remainingTime / 60)} minutes`,
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Clear any existing session first
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        await supabase.auth.signOut();
      }
      
      console.log("Attempting sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        if (error.message.includes('Invalid login credentials')) {
          setError("Invalid email or password. Please check your credentials and try again.");
          updateRateLimit();
        } else if (error.message.includes('Email not confirmed')) {
          setError("Please verify your email before signing in. Check your inbox for the confirmation link.");
        } else if (error.message.includes('Invalid API key')) {
          setError("Authentication service configuration error. Please contact support.");
        } else {
          setError(error.message);
        }
        handleAuthError(error);
        return;
      }

      if (!data.session) {
        setError("Failed to create session. Please try again.");
        return;
      }

      console.log("Sign in successful:", data.session);
      await handleAuthSuccess(data.session);
    } catch (error) {
      console.error("Unexpected error during signin:", error);
      setError("An unexpected error occurred. Please try again.");
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-16 px-6 rounded-xl border-2 border-gray-200 bg-white 
                     focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors
                     text-base md:text-lg w-full"
          disabled={isLocked}
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-16 px-6 rounded-xl border-2 border-gray-200 bg-white 
                     focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors
                     text-base md:text-lg w-full"
          disabled={isLocked}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-16 px-8 rounded-xl font-medium transition-all duration-200
                 bg-gradient-to-r from-[#D946EF] via-[#FF3D77] to-[#FF8A3D] text-white
                 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
                 active:scale-95 text-base md:text-lg" 
        disabled={loading || isLocked}
      >
        {isLocked 
          ? `Try again in ${Math.ceil(remainingTime / 60)} minutes` 
          : loading 
            ? "Loading..." 
            : "Sign In"
        }
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        By continuing, you're confirming that you've read our Terms & Conditions and Cookie Policy
      </p>
      
      <p className="text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onViewChange("sign_up")}
          className="text-primary hover:underline"
          disabled={isLocked}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};