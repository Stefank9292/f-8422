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
    <Card className="w-full bg-sidebar-accent p-4 space-y-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-medium text-foreground">Request Usage</h4>
        </div>
        
        {/* Usage Stats */}
        <div className="space-y-3">
          {/* Numbers */}
          <div className="flex justify-between text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{usedClicks}</span>
              <span className="text-xs text-muted-foreground">used</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-foreground">{remainingClicks}</span>
              <span className="text-xs text-muted-foreground">remaining</span>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress 
            value={usagePercentage} 
            className="h-3 bg-secondary"
          />

          {/* Total */}
          <p className="text-xs text-muted-foreground text-center">
            {maxClicks} total clicks per period
          </p>
        </div>
      </div>
    </Card>
  );
};