import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

interface SubscriptionOverviewProps {
  planName?: string;
  usedClicks: number;
  remainingClicks: number;
  maxClicks: number;
  isCanceled?: boolean;
}

export const SubscriptionOverview = ({ 
  usedClicks, 
  remainingClicks, 
  maxClicks
}: SubscriptionOverviewProps) => {
  const usagePercentage = (usedClicks / maxClicks) * 100;

  return (
    <Card className="w-full bg-sidebar p-4 space-y-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Request Usage</h4>
        </div>
        
        {/* Usage Stats */}
        <div className="space-y-3">
          {/* Numbers */}
          <div className="flex justify-between text-sm">
            <span className="font-medium">{usedClicks} used</span>
            <span className="font-medium">{remainingClicks} remaining</span>
          </div>

          {/* Progress Bar */}
          <Progress 
            value={usagePercentage} 
            className="h-2 bg-secondary"
          />

          {/* Total */}
          <p className="text-sm text-muted-foreground">
            Total: {maxClicks} per period
          </p>
        </div>
      </div>
    </Card>
  );
};