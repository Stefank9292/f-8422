import { ReactNode } from "react";
import { UserAvatar } from "./UserAvatar";
import { cn } from "@/lib/utils";

interface CircleProgressAvatarProps {
  progress: number;
  isSteroidsUser: boolean;
  isProUser: boolean;
  className?: string;
  children?: ReactNode;
}

export const CircleProgressAvatar = ({
  progress,
  isSteroidsUser,
  isProUser,
  className,
  children
}: CircleProgressAvatarProps) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(1 - progress / 100) * circumference} ${circumference}`;

  return (
    <div className={cn("relative w-8 h-8", className)}>
      <div className="absolute inset-0 -m-0.5">
        <svg 
          className="w-[calc(100%+4px)] h-[calc(100%+4px)]" 
          viewBox="0 0 120 120"
        >
          <circle
            className="text-sidebar-accent/20"
            strokeWidth="8"
            stroke="currentColor"
            fill="none"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="text-primary"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            r={radius}
            cx="60"
            cy="60"
            strokeDasharray={strokeDasharray}
            transform="rotate(-90 60 60)"
          />
        </svg>
      </div>
      <UserAvatar 
        isSteroidsUser={isSteroidsUser} 
        isProUser={isProUser}
        className="bg-muted border border-border relative z-10"
      >
        {children}
      </UserAvatar>
    </div>
  );
};