import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";

interface UserProfileInfoProps {
  email: string | undefined;
  planName: string;
  isSteroidsUser: boolean;
  isProUser: boolean;
  onSignOut: () => void;
}

export const UserProfileInfo = ({
  email,
  planName,
  isSteroidsUser,
  isProUser,
  onSignOut,
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

      <div className="mt-3 flex justify-center">
        <button
          onClick={onSignOut}
          className="px-2 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-sidebar-foreground/70 hover:bg-sidebar-accent/20 transition-colors"
        >
          <LogOut className="h-3 w-3" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};