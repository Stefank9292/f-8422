import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignInFormProps {
  onViewChange: (view: "sign_in" | "sign_up") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const RATE_LIMIT_KEY = 'signin_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const SignInForm = ({ onViewChange, loading, setLoading }: SignInFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkRateLimit = () => {
    const rateLimitData = localStorage.getItem(RATE_LIMIT_KEY);
    if (rateLimitData) {
      const { attempts, timestamp } = JSON.parse(rateLimitData);
      const timeElapsed = Date.now() - timestamp;
      
      if (attempts >= MAX_ATTEMPTS && timeElapsed < LOCKOUT_DURATION) {
        setIsLocked(true);
        setRemainingTime(Math.ceil((LOCKOUT_DURATION - timeElapsed) / 1000));
      } else if (timeElapsed >= LOCKOUT_DURATION) {
        localStorage.removeItem(RATE_LIMIT_KEY);
        setIsLocked(false);
        setRemainingTime(0);
      }
    }
  };

  const updateRateLimit = () => {
    const rateLimitData = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (rateLimitData) {
      const { attempts, timestamp } = JSON.parse(rateLimitData);
      const timeElapsed = now - timestamp;
      
      if (timeElapsed < LOCKOUT_DURATION) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
          attempts: attempts + 1,
          timestamp: now
        }));
      } else {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
          attempts: 1,
          timestamp: now
        }));
      }
    } else {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
        attempts: 1,
        timestamp: now
      }));
    }
  };

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

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      updateRateLimit();
      checkRateLimit();
      
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setLoading(false);
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