import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItemType {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  showWhen?: (status: any) => boolean;
  badge?: string;
}

interface SidebarSectionProps {
  title: string;
  items: MenuItemType[];
  subscriptionStatus?: any;
  onNavigate: (url: string) => void;
  currentPath: string;
}

export function SidebarSection({ 
  title, 
  items, 
  subscriptionStatus, 
  onNavigate, 
  currentPath 
}: SidebarSectionProps) {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";

  return (
    <div className="space-y-2 py-2">
      <div className={cn("flex items-center justify-between px-4 py-2", isCollapsed ? "h-auto" : "h-[40px]")}>
        <span className={cn("text-[11px] text-sidebar-foreground/70 transition-all duration-200", isCollapsed ? "opacity-0 hidden" : "opacity-100")}>
          {title}
        </span>
      </div>
      <nav className="space-y-1 px-2">
        {items.map((item) => {
          // Skip rendering if showWhen condition is defined and returns false
          if (item.showWhen && !item.showWhen(subscriptionStatus)) {
            return null;
          }

          return (
            <TooltipProvider key={item.url} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={item.onClick || (item.url ? () => onNavigate(item.url!) : undefined)}
                    isActive={item.url ? currentPath === item.url : false}
                    className={cn(
                      "w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[11px] transition-colors group relative",
                      item.className
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
                  </SidebarMenuButton>
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
          );
        })}
      </nav>
    </div>
  );
}