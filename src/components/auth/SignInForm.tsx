import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthError } from "@supabase/supabase-js";

interface SignInFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignInForm = ({ onViewChange, loading, setLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Account Not Found",
            description: "We couldn't find an account with these credentials. Would you like to sign up instead?",
            variant: "destructive",
          });
          updateRateLimit();
          return;
        }
        
        handleAuthError(error);
        return;
      }

      if (!data.session) {
        throw new Error("No session created after authentication");
      }

      await handleAuthSuccess(data.session);
    } catch (error) {
      console.error("Unexpected error during signin:", error);
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="material-input"
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
          className="material-input"
          disabled={isLocked}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full material-button-primary" 
        disabled={loading || isLocked}
      >
        {isLocked 
          ? `Try again in ${Math.ceil(remainingTime / 60)} minutes` 
          : loading 
            ? "Loading..." 
            : "Sign In"
        }
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        By continuing, you're confirming that you've read our Terms & Conditions and Cookie Policy
      </p>
      
      <p className="text-sm text-center text-muted-foreground">
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