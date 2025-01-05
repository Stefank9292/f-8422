import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserAvatar } from "./UserAvatar";

interface UserProfileInfoProps {
  email: string | undefined;
  planName: string;
  isSteroidsUser: boolean;
  isProUser: boolean;
}

export const UserProfileInfo = ({
  email,
  planName,
  isSteroidsUser,
  isProUser,
}: UserProfileInfoProps) => {
  return (
    <div className="w-full p-3 bg-card/50 rounded-xl border border-border/50">
      <div className="flex items-center gap-3">
        <UserAvatar isSteroidsUser={isSteroidsUser} isProUser={isProUser} />
        
        <div className="flex flex-col">
          <span className="text-[11px] text-sidebar-foreground/70 truncate max-w-[150px]">
            {email}
          </span>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] ${
              isSteroidsUser 
                ? 'bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#F97316] text-transparent bg-clip-text animate-pulse font-medium'
                : 'text-sidebar-foreground/50'
            }`}>
              {planName}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50">Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};