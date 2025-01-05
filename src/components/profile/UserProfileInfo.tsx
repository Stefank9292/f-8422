import { UserAvatar } from "./UserAvatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";

interface UserProfileInfoProps {
  email: string | undefined;
  planName: string;
  isSteroidsUser: boolean;
  isProUser: boolean;
  isUltraPlan: boolean;
  usagePercentage: number;
  usedRequests: number;
  maxRequests: number;
  remainingRequests: number;
  hasReachedLimit: boolean;
}

export const UserProfileInfo = ({
  email,
  planName,
  isSteroidsUser,
  isProUser,
  isUltraPlan,
  usagePercentage,
  usedRequests,
  maxRequests,
  remainingRequests,
  hasReachedLimit,
}: UserProfileInfoProps) => {
  return (
    <div className="w-full p-3 bg-card/50 rounded-xl border border-border/50">
      <div className="flex items-start gap-3">
        <UserAvatar isSteroidsUser={isSteroidsUser} isProUser={isProUser} />
        
        <div className="flex flex-col">
          <span className="text-[11px] text-sidebar-foreground/70 truncate max-w-[150px]">
            {email}
          </span>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] ${
              isSteroidsUser 
                ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text animate-pulse font-medium'
                : 'text-sidebar-foreground/50'
            }`}>
              {planName}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50">Plan</span>
          </div>

          <div className="mt-4">
            {isUltraPlan ? (
              <div className="flex flex-col">
                <span className="text-[10px] text-sidebar-foreground/60">
                  {usedRequests} requests this month
                </span>
                <div className="flex items-center gap-1">
                  <CircleUserRound className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span className="text-[10px] bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
                    Unlimited Usage
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] text-sidebar-foreground/70">Monthly Usage</span>
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
    </div>
  );
};