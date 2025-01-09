import { UserAvatar } from "./UserAvatar";
import { Progress } from "@/components/ui/progress";
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
                ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text font-medium'
                : 'text-sidebar-foreground/50'
            }`}>
              {planName}
            </span>
            <span className="text-[9px] text-sidebar-foreground/50 truncate max-w-[150px]">
              {email}
            </span>
          </div>
        </div>

        {(isUltraPlan || isSteroidsUser) ? (
          <div className="flex items-center gap-3">
            <UserAvatar 
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser} 
              className="bg-muted border border-border"
            >
              <Infinity className="h-4 w-4 text-foreground" />
            </UserAvatar>
            <div className="flex flex-col">
              <span className="text-[10px] bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text font-medium">
                Unlimited Usage
              </span>
              {isSteroidsUser && (
                <span className="text-[9px] text-sidebar-foreground/50">
                  {usedRequests} requests this month
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <UserAvatar 
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser}
              className="bg-muted border border-border"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-medium text-foreground">
                  {remainingRequests}
                </span>
              </div>
            </UserAvatar>
            <div className="flex flex-col">
              {isSteroidsUser ? (
                <div className="space-y-2">
                  <span className="text-[10px] text-sidebar-foreground/50">Monthly Usage</span>
                  <Progress value={usagePercentage} className="h-1 bg-sidebar-accent/20" />
                  <div className="flex justify-between text-[8px] text-sidebar-foreground/50">
                    <span>{usedRequests}</span>
                    <span className="text-primary/70">{remainingRequests} left</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[10px] text-sidebar-foreground/50">
                    {remainingRequests} searches left
                  </span>
                  {hasReachedLimit && (
                    <Link 
                      to="/subscribe" 
                      className="text-[10px] text-primary hover:text-primary/80 transition-colors"
                    >
                      Upgrade plan →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};