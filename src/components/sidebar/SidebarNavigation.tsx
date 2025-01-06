import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { SidebarSection } from "./SidebarSection";
import { FileText } from "lucide-react";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: "This is a page",
      url: "/this-is-a-page",
      icon: FileText,
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
        <SidebarSection
          title=""
          items={navigationItems}
          onNavigate={(url) => navigate(url)}
          currentPath={location.pathname}
        />
      </nav>
    </div>
  );
}