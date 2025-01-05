import { UserAvatar } from "./UserAvatar";
import { CircleProgressAvatar } from "./CircleProgressAvatar";
import { Link } from "react-router-dom";
import { Infinity } from "lucide-react";

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
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar isSteroidsUser={isSteroidsUser} isProUser={isProUser} />
          <div className="flex flex-col">
            <span className={`text-[10px] ${
              isSteroidsUser 
                ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text animate-pulse font-medium'
                : 'text-sidebar-foreground/50'
            }`}>
              {planName}
            </span>
            <span className="text-[9px] text-sidebar-foreground/50 truncate max-w-[150px]">
              {email}
            </span>
          </div>
        </div>

        {isUltraPlan ? (
          <div className="flex items-center gap-3">
            <CircleProgressAvatar 
              progress={0}
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser}
            >
              <Infinity className="h-4 w-4 text-foreground" />
            </CircleProgressAvatar>
            <div className="flex flex-col">
              <span className="text-[10px] bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
                Unlimited Usage
              </span>
              <span className="text-[9px] text-sidebar-foreground/50">
                {usedRequests} requests this month
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CircleProgressAvatar 
              progress={usagePercentage}
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-medium text-foreground">
                  {remainingRequests}
                </span>
              </div>
            </CircleProgressAvatar>
            <div className="flex flex-col">
              <div className="space-y-2">
                <span className="text-[10px] text-sidebar-foreground/50">Monthly Usage</span>
                <div className="flex justify-between text-[8px] text-sidebar-foreground/50">
                  <span>{usedRequests} {maxRequests} requests</span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};