import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";

  const navigationItems = [
    {
      title: "Viral Video Search",
      path: "/",
      icon: Search,
      badge: "BETA"
    },
    {
      title: "Search History",
      path: "/history",
      icon: History
    }
  ];

  return (
    <div className="space-y-2 py-2">
      <div className={cn("flex items-center justify-between px-4 py-2", isCollapsed ? "h-auto" : "h-[40px]")}>
        <span className={cn("text-sm font-medium transition-all duration-200", isCollapsed ? "opacity-0 hidden" : "opacity-100")}>
          Navigation
        </span>
      </div>
      <nav className="space-y-1 px-2">
        {navigationItems.map((item) => (
          <TooltipProvider key={item.path} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[11px] transition-colors group relative",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 text-[8px] text-primary font-medium bg-transparent border-0 p-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="text-xs"
                hidden={!isCollapsed}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
    </div>
  );
}