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
    <Card className="w-full bg-sidebar">
      <div className="p-4 space-y-4">
        {/* Usage Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <h4 className="text-xs font-medium">Request Usage</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usedClicks} used</span>
              <span>{remainingClicks} remaining</span>
            </div>
            <Progress 
              value={usagePercentage} 
              className="h-1.5 bg-secondary"
            />
            <p className="text-xs text-muted-foreground">
              Total: {maxClicks} per period
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};