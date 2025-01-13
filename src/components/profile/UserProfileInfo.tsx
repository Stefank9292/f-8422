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
    <div className="w-full p-4 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-200 hover:bg-card/70">
      <div className="flex flex-col gap-4">
        <Link 
          to="/profile" 
          className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group"
        >
          <UserAvatar 
            isSteroidsUser={isSteroidsUser} 
            isProUser={isProUser} 
            className="transition-transform duration-200 group-hover:scale-105 shadow-sm"
          />
          <div className="flex flex-col">
            <span className={`text-[11px] font-medium tracking-tight ${
              isSteroidsUser 
                ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text'
                : 'text-sidebar-foreground/70'
            }`}>
              {planName}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 truncate max-w-[150px] font-medium">
              {email}
            </span>
          </div>
        </Link>

        {isUltraPlan ? (
          <div className="flex items-center gap-3">
            <UserAvatar 
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser} 
              className="bg-muted/50 border border-border/50 backdrop-blur-sm shadow-sm"
            >
              <Infinity className="h-4 w-4 text-foreground/70" />
            </UserAvatar>
            <div className="flex flex-col">
              <span className="text-[11px] bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text font-medium tracking-tight">
                Unlimited Usage
              </span>
              {isSteroidsUser && (
                <span className="text-[10px] text-sidebar-foreground/50 font-medium">
                  {usedRequests.toLocaleString()} requests this month
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <UserAvatar 
              isSteroidsUser={isSteroidsUser} 
              isProUser={isProUser}
              className="bg-muted/50 border border-border/50 backdrop-blur-sm shadow-sm"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] font-medium text-foreground/70">
                  {remainingRequests}
                </span>
              </div>
            </UserAvatar>
            <div className="flex flex-col w-full">
              {isSteroidsUser ? (
                <div className="space-y-2.5 w-full">
                  <span className="text-[11px] text-sidebar-foreground/60 font-medium">Monthly Usage</span>
                  <Progress 
                    value={usagePercentage} 
                    className="h-1.5 bg-sidebar-accent/20" 
                  />
                  <div className="flex justify-between text-[9px] font-medium">
                    <span className="text-sidebar-foreground/50">
                      {usedRequests.toLocaleString()}
                    </span>
                    <span className="text-primary/80">
                      {remainingRequests.toLocaleString()} left
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[11px] text-sidebar-foreground/60 font-medium">
                    {remainingRequests.toLocaleString()} searches left
                  </span>
                  {hasReachedLimit && (
                    <Link 
                      to="/subscribe" 
                      className="text-[10px] text-primary hover:text-primary/80 transition-colors font-medium mt-0.5"
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