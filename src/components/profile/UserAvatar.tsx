import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Crown, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface UserAvatarProps {
  isSteroidsUser: boolean;
  isProUser: boolean;
  className?: string;
  children?: ReactNode;
}

export const UserAvatar = ({ isSteroidsUser, isProUser, className, children }: UserAvatarProps) => {
  const getPlanIcon = () => {
    if (children) return children;
    if (isSteroidsUser) return <Rocket className="h-3.5 w-3.5" />;
    if (isProUser) return <Crown className="h-3.5 w-3.5" />;
    return <User className="h-3.5 w-3.5" />;
  };

  return (
    <Avatar className={cn("h-8 w-8 ring-2 ring-border/5", className)}>
      <AvatarFallback className="bg-background/80 text-foreground/70">
        {getPlanIcon()}
      </AvatarFallback>
    </Avatar>
  );
};