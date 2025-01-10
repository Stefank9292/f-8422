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

export const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
    }
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [session?.user, profile]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const updates = [];

      // Update email if changed
      if (email !== session?.user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ 
          email: email 
        });
        if (emailError) throw emailError;
        updates.push("email");
      }

      // Update username if changed
      if (username !== profile?.username) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', session?.user?.id);
        
        if (profileError) throw profileError;
        updates.push("username");
      }

      // Update password if provided
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
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            {newPassword && (
              <PasswordStrengthIndicator passwordStrength={passwordStrength} />
            )}
          </div>

          <Button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="w-full primary-gradient"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
};