import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";

  const items = [
    {
      title: "Search History",
      url: "/history",
      icon: History,
    },
  ];

  return (
    <div className="space-y-2 py-2">
      <div className={cn("flex items-center justify-between px-4 py-2", isCollapsed ? "h-auto" : "h-[40px]")}>
        <span className={cn("text-sm font-medium transition-all duration-200", isCollapsed ? "opacity-0 hidden" : "opacity-100")}>
          Navigation
        </span>
      </div>
      <nav className="space-y-1 px-2">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.url)}
            className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[11px] 
              text-sidebar-foreground/70 hover:bg-sidebar-accent/20
              transition-colors group relative`}
          >
            <item.icon className="h-3.5 w-3.5" />
            <span>{item.title}</span>
            <Badge 
              variant="secondary" 
              className="ml-1 text-[8px] text-primary font-medium bg-transparent border-0 p-0"
            >
              BETA
            </Badge>
          </button>
        ))}
      </nav>
    </div>
  );
}