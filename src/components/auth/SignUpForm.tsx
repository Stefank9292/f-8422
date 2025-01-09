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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "bg-red-500/20"
  });
  
  const { handleAuthError, handleAuthSuccess } = useAuthForm({
    mode: 'sign_up',
    onSuccess: () => navigate("/auth/confirm-email", { state: { email } })
  });

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const validateForm = () => {
    setError(null);

    if (inviteCode !== "Vyral2025") {
      setError("Invalid invite code. Please enter a valid invite code to sign up.");
      return false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting signup with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            email,
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        setError(error.message);
        handleAuthError(error);
        return;
      }

      console.log("Signup response:", data);

      if (!data.session) {
        toast({
          title: "Verification Required",
          description: "Please check your email to verify your account.",
        });
        navigate("/auth/confirm-email", { state: { email } });
        return;
      }

      await handleAuthSuccess(data.session);
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      setError("An unexpected error occurred. Please try again.");
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <Alert variant="destructive">
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
          className="material-input"
        />
      </div>
      
      <Button type="submit" className="w-full material-button-primary" disabled={loading}>
        {loading ? "Loading..." : "Sign Up"}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        By continuing, you're confirming that you've read our Terms & Conditions and Cookie Policy
      </p>
      
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onViewChange("sign_in")}
          className="text-primary hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};