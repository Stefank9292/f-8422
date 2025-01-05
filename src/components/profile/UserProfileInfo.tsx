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
    <div className="w-full p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <UserAvatar isSteroidsUser={isSteroidsUser} isProUser={isProUser} />
          <div className="flex flex-col gap-0.5">
            <span className={`text-xs font-medium ${
              isSteroidsUser 
                ? 'instagram-gradient text-transparent bg-clip-text animate-pulse'
                : 'text-foreground/80'
            }`}>
              {planName}
            </span>
            <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
              {email}
            </span>
          </div>
        </div>

        {isUltraPlan ? (
          <div className="flex items-center gap-4">
            <CircleProgressAvatar 
              progress={0}
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser}
            >
              <Infinity className="h-4 w-4 text-foreground/80" />
            </CircleProgressAvatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium instagram-gradient text-transparent bg-clip-text animate-pulse">
                Unlimited Usage
              </span>
              <span className="text-[11px] text-muted-foreground">
                {usedRequests.toLocaleString()} requests this month
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <CircleProgressAvatar 
              progress={usagePercentage}
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-foreground/80">
                  {remainingRequests.toLocaleString()}
                </span>
              </div>
            </CircleProgressAvatar>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-foreground/80">Monthly Usage</span>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{usedRequests.toLocaleString()}/{maxRequests.toLocaleString()} requests</span>
                <span className="text-primary/80 font-medium">{remainingRequests.toLocaleString()} left</span>
                {hasReachedLimit && (
                  <Link 
                    to="/subscribe" 
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Upgrade plan →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};