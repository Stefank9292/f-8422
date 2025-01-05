import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Crown, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  isSteroidsUser: boolean;
  isProUser: boolean;
  className?: string;
}

export const UserAvatar = ({ isSteroidsUser, isProUser, className }: UserAvatarProps) => {
  const getPlanIcon = () => {
    if (isSteroidsUser) return <Rocket className="h-4 w-4" />;
    if (isProUser) return <Crown className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarFallback>{getPlanIcon()}</AvatarFallback>
    </Avatar>
  );
};