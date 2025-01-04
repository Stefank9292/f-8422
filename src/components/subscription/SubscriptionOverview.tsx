import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, CreditCard } from "lucide-react";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";

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

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 space-y-8">
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