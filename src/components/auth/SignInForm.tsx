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

    // Validate email and password before proceeding
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // First, ensure no existing session
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        await supabase.auth.signOut();
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail.toLowerCase(),
        password: trimmedPassword,
      });

      if (error) {
        console.error("Sign in error:", error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Authentication Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
          updateRateLimit();
        } else {
          handleAuthError(error);
        }
        return;
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