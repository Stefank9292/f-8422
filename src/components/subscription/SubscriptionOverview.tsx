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
  planName,
  isCanceled 
}: SubscriptionOverviewProps) => {
  return (
    <Card className="w-full bg-sidebar-accent p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-sidebar-foreground" />
          <h4 className="text-sm font-medium text-sidebar-foreground">
            {planName || 'Free Plan'}
            {isCanceled && <span className="text-destructive ml-2">(Canceled)</span>}
          </h4>
        </div>
      </div>
    </Card>
  );
};