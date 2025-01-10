import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthForm } from "@/hooks/useAuthForm";

interface SignInFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
}

export const SignInForm = ({ onViewChange }: SignInFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleAuthError, handleAuthSuccess } = useAuthForm({
    mode: 'sign_in',
    onSuccess: () => {
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo);
    }
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        handleAuthError(error);
        return;
      }

      if (data.session) {
        await handleAuthSuccess(data.session);
      }
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
          disabled={loading}
          className="material-input"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="material-input"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full material-button-primary" 
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onViewChange("sign_up")}
          className="text-primary hover:underline"
          disabled={loading}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};