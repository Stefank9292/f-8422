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
  isSteroidsUser,
  isProUser,
  className,
  children
}: CircleProgressAvatarProps) => {
  return (
    <div className={cn("relative w-8 h-8", className)}>
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