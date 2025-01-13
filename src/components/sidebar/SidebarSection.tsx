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
      <div className={cn(
        "flex items-center px-5 py-2",
        isCollapsed ? "h-auto" : "h-[40px]"
      )}>
        <span className={cn(
          "text-[11px] font-medium text-sidebar-foreground/60 transition-all duration-200",
          isCollapsed ? "opacity-0 hidden" : "opacity-100"
        )}>
          {title}
        </span>
      </div>
      <nav className="space-y-1 px-3">
        {items.map((item) => {
          if (item.showWhen && !item.showWhen(subscriptionStatus)) {
            return null;
          }

          const getBadgeColor = (badge: string) => {
            switch (badge) {
              case 'LIVE':
                return 'text-emerald-500';
              case 'NEW':
                return 'text-primary';
              default:
                return 'text-primary';
            }
          };

          return (
            <TooltipProvider key={item.title} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={item.onClick || (item.url && item.url !== "#" ? () => onNavigate(item.url!) : undefined)}
                    isActive={item.url ? currentPath === item.url : false}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg flex items-center gap-3 text-[11px] transition-all duration-200 group relative hover:bg-sidebar-accent/10",
                      item.className
                    )}
                  >
                    <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "ml-1 text-[8px] font-medium bg-transparent border-0 p-0",
                          getBadgeColor(item.badge)
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="text-xs font-medium"
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