import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { validatePassword, checkPasswordStrength } from "@/utils/auth/validation";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const { data, error } = await supabase.auth.signUp({
        email,
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
    <form onSubmit={handleSignUp} className="space-y-4">
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
      <div className="space-y-2 relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
          className="material-input-with-icon"
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
        {password && <PasswordStrengthIndicator passwordStrength={passwordStrength} />}
      </div>
      <div className="space-y-2 relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="material-input-with-icon"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="material-input-icon"
          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
        >
          {showConfirmPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
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