import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

interface UsageProgressProps {
  isUltraPlan: boolean;
  usagePercentage: number;
  usedRequests: number;
  maxRequests: number;
  remainingRequests: number;
  hasReachedLimit: boolean;
}

export const UsageProgress = ({
  isUltraPlan,
  usagePercentage,
  usedRequests,
  maxRequests,
  remainingRequests,
  hasReachedLimit,
}: UsageProgressProps) => {
  return (
    <div className="space-y-1.5 w-full text-center">
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-sidebar-foreground/70">
        <Activity className="h-3 w-3" />
        <span>Monthly Usage</span>
      </div>

      <div className="space-y-1">
        {isUltraPlan ? (
          <div className="text-[9px] text-sidebar-foreground/60 flex items-center justify-center gap-1">
            <span className="bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
              Unlimited Usage
            </span>
            <span className="text-green-500">•</span>
            <span>{usedRequests} requests this month</span>
          </div>
        ) : (
          <>
            <Progress value={usagePercentage} className="h-1 bg-sidebar-accent/20" />
            <div className="flex justify-between text-[9px] text-sidebar-foreground/60">
              <span>{usedRequests}/{maxRequests}</span>
              <span>{remainingRequests} left</span>
            </div>
            {hasReachedLimit && !isUltraPlan && (
              <Link 
                to="/subscribe" 
                className="text-[9px] text-primary hover:text-primary/80 transition-colors mt-1 inline-block"
              >
                Upgrade plan for more searches →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};