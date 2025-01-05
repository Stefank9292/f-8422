import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Crown, Rocket } from "lucide-react";

interface UserAvatarProps {
  isSteroidsUser: boolean;
  isProUser: boolean;
}

export const UserAvatar = ({ isSteroidsUser, isProUser }: UserAvatarProps) => {
  const getPlanIcon = () => {
    if (isSteroidsUser) return <Rocket className="h-4 w-4" />;
    if (isProUser) return <Crown className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback>{getPlanIcon()}</AvatarFallback>
    </Avatar>
  );
};