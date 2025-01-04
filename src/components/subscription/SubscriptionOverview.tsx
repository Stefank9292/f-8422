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
    <Card className="w-full bg-sidebar-accent p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-sidebar-foreground" />
          <h4 className="text-sm font-medium text-sidebar-foreground">Request Usage</h4>
        </div>
        
        {/* Usage Stats */}
        <div className="space-y-2">
          {/* Progress Bar */}
          <Progress 
            value={usagePercentage} 
            className="h-2.5 bg-sidebar-accent"
          />

          {/* Usage Percentage */}
          <div className="text-center">
            <span className={`text-xs font-medium ${
              usagePercentage > 90 ? 'text-destructive' :
              usagePercentage > 75 ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {usagePercentage.toFixed(1)}% Used
            </span>
          </div>

          {/* Numbers */}
          <div className="flex justify-between text-xs">
            <span className="text-sidebar-foreground">
              <span className="font-medium">{usedClicks}</span> used
            </span>
            <span className="text-sidebar-foreground">
              <span className="font-medium">{remainingClicks}</span> remaining
            </span>
          </div>

          {/* Total */}
          <p className="text-xs text-sidebar-foreground/70">
            Total: {maxClicks} per month
          </p>
        </div>
      </div>
    </Card>
  );
};