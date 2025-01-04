import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";

interface SidebarToolsProps {
  currentPath: string;
  subscriptionStatus?: any;
}

export function SidebarTools({ currentPath, subscriptionStatus }: SidebarToolsProps) {
  const navigate = useNavigate();

  const items = [
    {
      title: "Search",
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
            } transition-colors`}
          >
            <item.icon className="h-3.5 w-3.5" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}