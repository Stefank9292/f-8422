import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, CreditCard, User } from "lucide-react";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SubscriptionOverviewProps {
  planName?: string;
  usedClicks: number;
  remainingClicks: number;
  maxClicks: number;
  isCanceled?: boolean;
}

export const SubscriptionOverview = ({ 
  planName, 
  usedClicks, 
  remainingClicks, 
  maxClicks,
  isCanceled
}: SubscriptionOverviewProps) => {
  const usagePercentage = (usedClicks / maxClicks) * 100;
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const handleResetPassword = async () => {
    try {
      if (!session?.user?.email) {
        throw new Error("No email found");
      }

      // Using a single await to prevent multiple reads of the response stream
      const response = await supabase.auth.resetPasswordForEmail(session.user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/reset-password`
        }
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success",
        description: "Password reset email has been sent. Please check your inbox.",
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset password email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 space-y-8">
        {/* User Profile Section */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
              <Button
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-2xl">Subscription Overview</h2>
          </div>
          {planName && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Current Plan:</span>
              <Badge variant="outline" className="text-base font-medium">
                {planName}
              </Badge>
            </div>
          )}
        </div>

        {/* Usage Stats */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <h3 className="text-lg">Request Usage</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{usedClicks} used</span>
                <span>{remainingClicks} remaining</span>
              </div>
              <Progress 
                value={usagePercentage} 
                className="h-2 bg-secondary"
              />
              <p className="text-sm text-muted-foreground">
                Total requests: {maxClicks} per period
              </p>
            </div>
          </div>

          {/* Action Button */}
          {isCanceled ? (
            <ResumeSubscriptionButton className="w-full bg-primary/5 hover:bg-primary/10">
              Resume Subscription
            </ResumeSubscriptionButton>
          ) : (
            <CancelSubscriptionButton 
              isCanceled={isCanceled}
              className="w-full bg-secondary/50 hover:bg-secondary/80"
            >
              Cancel Subscription
            </CancelSubscriptionButton>
          )}
        </div>
      </div>
    </Card>
  );
};