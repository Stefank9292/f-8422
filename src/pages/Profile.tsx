import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validatePassword } from "@/utils/auth/validation";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { checkPasswordStrength } from "@/utils/auth/validation";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
    }
  }, [session?.user]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const updates = [];

      if (email !== session?.user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ 
          email: email 
        });
        if (emailError) throw emailError;
        updates.push("email");
      }

      if (newPassword) {
        const passwordValidation = validatePassword(newPassword);
        if (passwordValidation) {
          toast({
            title: "Error",
            description: passwordValidation,
            variant: "destructive",
          });
          return;
        }

        const { error: passwordError } = await supabase.auth.updateUser({ 
          password: newPassword 
        });
        if (passwordError) throw passwordError;
        updates.push("password");
        setNewPassword("");
      }

      if (updates.length > 0) {
        toast({
          title: "Success",
          description: `Updated ${updates.join(", ")} successfully`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = checkPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11"
              />
            </div>

            <div className="space-y-4">
              <label htmlFor="password" className="text-sm font-medium block">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-11"
              />
              {newPassword && (
                <div className="mt-2">
                  <PasswordStrengthIndicator passwordStrength={passwordStrength} />
                </div>
              )}
            </div>

            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full h-11 primary-gradient"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;