import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarTrigger() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "fixed top-4 left-4 z-50 h-8 w-8 rounded-lg border shadow-sm transition-all duration-200",
        "md:left-[calc(var(--sidebar-width)_-_1.5rem)]",
        isCollapsed && "md:left-[calc(var(--sidebar-width-icon)_-_1.5rem)]",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      )}
    >
      <PanelLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}