import { Badge } from "@/components/ui/badge";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

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
  return (
    <>
      <SidebarMenuItem>
        <div className="px-2 pt-4 pb-2">
          <span className="text-xs font-semibold text-muted-foreground">{title}</span>
        </div>
      </SidebarMenuItem>
      {items.map((item) => {
        // Skip rendering if showWhen condition is defined and returns false
        if (item.showWhen && !item.showWhen(subscriptionStatus)) {
          return null;
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={item.onClick || (item.url ? () => onNavigate(item.url!) : undefined)}
              isActive={item.url ? currentPath === item.url : false}
              className={item.className}
            >
              <item.icon className="h-4 w-4" />
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
          </SidebarMenuItem>
        );
      })}
    </>
  );
}