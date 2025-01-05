import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SidebarToolsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarTools({ currentPath, subscriptionStatus }: SidebarToolsProps) {
  const navigate = useNavigate();

  const items = [
    {
      title: "Viral Video Search",
      url: "/",
      icon: Search,
    },
  ];

  return (
    <div className="px-2 py-2">
      <span className="text-[11px] text-sidebar-foreground/70 px-2">Tools</span>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.url)}
            className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[11px] ${
              currentPath === item.url 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/20'
            } transition-colors group relative`}
          >
            <item.icon className="h-3.5 w-3.5" />
            <span>{item.title}</span>
            <Badge 
              variant="secondary" 
              className="ml-1 text-[9px] bg-white/10 text-white/70 px-1.5 py-0"
            >
              BETA
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}