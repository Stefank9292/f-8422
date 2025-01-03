import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileProps {
  email: string | undefined;
}

export function UserProfile({ email }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="text-sm text-sidebar-foreground truncate">
          {email}
        </span>
      </div>
    </div>
  );
}