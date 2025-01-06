import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

const INVITE_CODE = "Vyral2025";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode !== INVITE_CODE) {
      toast({
        title: "Invalid Invite Code",
        description: "Please enter a valid invite code to sign up.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 100) {
      toast({
        title: "Weak Password",
        description: "Please ensure your password meets all requirements.",
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Welcome to VyralSearch
          </h1>
          <p className="text-muted-foreground">
            {view === "sign_in" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        
        <div className="material-card p-6 space-y-6">
          {view === "sign_in" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Sign In"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By continuing, you're confirming that you've read our Terms & Conditions and Cookie Policy
              </p>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("sign_up")}
                  className="text-primary hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className="space-y-2">
                  <Progress 
                    value={passwordStrength} 
                    className={`h-2 ${getPasswordStrengthColor()}`}
                  />
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Password requirements:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className={password.length >= 8 ? "text-green-500" : ""}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                        One uppercase letter
                      </li>
                      <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
                        One number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : ""}>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Invite Code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By continuing, you're confirming that you've read our Terms & Conditions and Cookie Policy
              </p>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("sign_in")}
                  className="text-primary hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;