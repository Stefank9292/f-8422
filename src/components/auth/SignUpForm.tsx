import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { validatePassword, checkPasswordStrength } from "@/utils/auth/validation";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthError } from "@supabase/supabase-js";

interface SignUpFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignUpForm = ({ onViewChange, loading, setLoading }: SignUpFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "bg-red-500/20"
  });
  
  const { handleAuthError, handleAuthSuccess } = useAuthForm({
    mode: 'sign_up',
    onSuccess: () => navigate("/subscribe")
  });

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !inviteCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (inviteCode !== "Vyral2025") {
      toast({
        title: "Invalid Invite Code",
        description: "Please enter a valid invite code to sign up.",
        variant: "destructive",
      });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // First check if session exists and sign out if it does
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        await supabase.auth.signOut();
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth',
          data: {
            email_confirmed: true // Skip email confirmation
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          onViewChange("sign_in");
          return;
        }
        
        handleAuthError(error);
        return;
      }

      if (data.session) {
        await handleAuthSuccess(data.session);
        navigate("/subscribe");
      } else {
        toast({
          title: "Account Created",
          description: "Please sign in with your credentials.",
        });
        onViewChange("sign_in");
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
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
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
          disabled={loading}
          className="material-input"
        />
        {password && <PasswordStrengthIndicator passwordStrength={passwordStrength} />}
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          className="material-input"
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-destructive mt-1">Passwords do not match</p>
        )}
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
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
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
      
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onViewChange("sign_in")}
          className="text-primary hover:underline"
          disabled={loading}
        >
          Sign In
        </button>
      </p>
    </form>
  );
};
