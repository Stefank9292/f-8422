import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRateLimit } from "@/hooks/useRateLimit";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isLocked, updateRateLimit } = useRateLimit({
    key: "signin_attempts",
    maxAttempts: 5,
    lockoutDuration: 5 * 60 * 1000 // 5 minutes
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait a moment before trying again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
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

        // Handle other errors
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        updateRateLimit();
        return;
      }

      // Redirect to the original destination or default route
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      updateRateLimit();
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
          className="h-9 text-[13px]"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-9 text-[13px]"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full h-9 text-[13px]" 
        disabled={loading || isLocked}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};