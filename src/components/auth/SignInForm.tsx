import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignInForm = ({ onViewChange, loading, setLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      setLoading(true);
      
      // First, ensure no existing session
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        handleAuthError(error);
        return;
      }

      await handleAuthSuccess(data.session);
    } catch (error) {
      handleAuthError(error as Error);
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
      <div className="space-y-2 relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="material-input-with-icon"
          disabled={isLocked}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="material-input-icon"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
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