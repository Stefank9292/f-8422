import { UserAvatar } from "./UserAvatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { CircleUserRound, Infinity } from "lucide-react";

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
          <span className={`text-[10px] ${
            isSteroidsUser 
              ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text animate-pulse font-medium'
              : 'text-sidebar-foreground/50'
          }`}>
            {planName}
          </span>
          <span className="text-[11px] text-sidebar-foreground/70 truncate max-w-[150px]">
            {email}
          </span>

          {isUltraPlan ? (
            <div className="flex items-start gap-3 mt-4">
              <UserAvatar 
                isSteroidsUser={false} 
                isProUser={false} 
                className="bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6]"
              >
                <Infinity className="h-4 w-4 text-white" />
              </UserAvatar>
              <div className="flex flex-col">
                <span className="text-[11px] text-sidebar-foreground/70">
                  <span className="bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
                    Unlimited Usage
                  </span>
                </span>
                <span className="text-[10px] text-sidebar-foreground/50">
                  {usedRequests} requests this month
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 mt-4">
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
  );
};