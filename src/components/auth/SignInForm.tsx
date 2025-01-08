import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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

    if (!captchaToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the reCAPTCHA verification.",
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
        options: {
          captchaToken
        }
      });

      if (error) {
        console.error("Sign in error:", error);
        updateRateLimit();
        checkRateLimit();
        
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An error occurred during sign in",
            variant: "destructive",
          });
        }
        return;
      }

      if (!data.session) {
        throw new Error("No session created after sign in");
      }

      // Verify the session is valid
      const { data: { user }, error: userError } = await supabase.auth.getUser(
        data.session.access_token
      );

      if (userError || !user) {
        throw new Error("Failed to verify user session");
      }

      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      
    } catch (error) {
      console.error("Sign in process error:", error);
      toast({
        title: "Error",
        description: "Failed to complete sign in process",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
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
      <div className="flex justify-center my-4">
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
          theme="dark"
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