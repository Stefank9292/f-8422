import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, CreditCard } from "lucide-react";

interface UsageOverviewProps {
  planName?: string;
  usedClicks: number;
  remainingClicks: number;
  maxClicks: number;
}

export const UsageOverview = ({ 
  planName, 
  usedClicks, 
  remainingClicks, 
  maxClicks 
}: UsageOverviewProps) => {
  const usagePercentage = (usedClicks / maxClicks) * 100;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Usage Overview</h2>
        </div>
        {planName && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Current Plan:</span>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {planName}
            </Badge>
          </div>
        )}
      </div>

      <Card className="p-6 space-y-4 bg-secondary/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Request Usage
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{usedClicks} used</span>
            <span>{remainingClicks} remaining</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Total requests: {maxClicks} per period
          </p>
        </div>
      </Card>
    </Card>
  );
};