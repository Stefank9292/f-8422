import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";

  return (
    <div className="space-y-2 py-2">
      <div className={cn("flex items-center justify-between px-4 py-2", isCollapsed ? "h-auto" : "h-[40px]")}>
        <span className={cn("text-sm font-medium transition-all duration-200", isCollapsed ? "opacity-0 hidden" : "opacity-100")}>
          Navigation
        </span>
      </div>
      <nav className="space-y-1 px-2">
      </nav>
    </div>
  );
}