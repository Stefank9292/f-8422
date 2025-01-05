import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";

interface UsageProgressProps {
  isUltraPlan: boolean;
  usagePercentage: number;
  usedRequests: number;
  maxRequests: number;
  remainingRequests: number;
  hasReachedLimit: boolean;
  isSteroidsUser: boolean;
  isProUser: boolean;
}

export const UsageProgress = ({
  isUltraPlan,
  usagePercentage,
  usedRequests,
  maxRequests,
  remainingRequests,
  hasReachedLimit,
  isSteroidsUser,
  isProUser,
}: UsageProgressProps) => {
  return (
    <div className="w-full space-y-2 px-3 py-2 bg-card/30 rounded-lg border border-border/50">
      <div className="flex items-start gap-3">
        <UserAvatar 
          isSteroidsUser={isSteroidsUser} 
          isProUser={isProUser} 
          className="h-8 w-8"
        />
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-sidebar-foreground/70">Monthly Usage</span>
            {isUltraPlan && (
              <span className="text-[10px] bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
                Unlimited Usage
              </span>
            )}
          </div>
          
          {isUltraPlan ? (
            <span className="text-[10px] text-sidebar-foreground/60">
              {usedRequests} requests this month
            </span>
          ) : (
            <div className="space-y-2 mt-1">
              <Progress value={usagePercentage} className="h-1 bg-sidebar-accent/20" />
              <div className="flex justify-between text-[9px] text-sidebar-foreground/60">
                <span>{usedRequests}/{maxRequests} requests</span>
                <span className="text-primary/70">{remainingRequests} left</span>
                {hasReachedLimit && (
                  <Link 
                    to="/subscribe" 
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Upgrade plan →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};