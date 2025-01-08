import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface SignUpFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignUpForm = ({ onViewChange, loading, setLoading }: SignUpFormProps) => {
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

  const checkPasswordStrength = (password: string) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    let score = 0;
    if (password.length >= minLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    if (score < 3) {
      return {
        score: (score / 5) * 100,
        message: "Weak – Password must include uppercase, lowercase, numbers, and special characters",
        color: "bg-red-500/80" // Bright red for weak
      };
    } else if (score < 5) {
      return {
        score: (score / 5) * 100,
        message: "Medium – Password could be stronger",
        color: "bg-yellow-500/80" // Bright yellow for medium
      };
    } else {
      return {
        score: 100,
        message: "Strong – Password meets all requirements",
        color: "bg-green-500/80" // Bright green for strong
      };
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must include at least one number";
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return "Password must include at least one special character";
    }
    return null;
  };

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

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
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
          <p className="text-sm text-destructive">Passwords do not match</p>
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