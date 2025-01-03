import { Search, CreditCard, LogOut, User, Moon, HelpCircle, MessageCircle, PanelLeftClose, History, BarChart2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const toolsMenuItems = [
  {
    title: "Video Search",
    url: "/",
    icon: Search,
  },
  {
    title: "Profile Analyzer",
    url: "/analyzer",
    icon: BarChart2,
  },
];

const historyMenuItems = [
  {
    title: "Recent Searches",
    url: "/history",
    icon: History,
  },
];

const secondaryMenuItems = [
  {
    title: "Manage Subscription",
    icon: CreditCard,
    url: "/subscribe",
  },
  {
    title: "Upgrade to Pro",
    icon: Star,
    url: "/subscribe",
    className: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
    showWhen: (subscriptionStatus: any) => !subscriptionStatus?.subscribed,
  },
  {
    title: "Dark Mode",
    icon: Moon,
    onClick: () => {
      document.documentElement.classList.toggle('dark');
    },
  },
  {
    title: "Help Center",
    icon: HelpCircle,
    url: "/help",
  },
  {
    title: "FAQs",
    icon: MessageCircle,
    url: "/faq",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { toggleSidebar, state } = useSidebar();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Navigation Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
            <span className={`text-sm font-medium ${state === 'collapsed' ? 'hidden' : ''}`}>Navigation</span>
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <PanelLeftClose className={`h-4 w-4 transition-transform ${state === 'collapsed' ? 'rotate-180' : ''}`} />
              <span className="sr-only">Toggle Sidebar</span>
            </button>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* User Profile Section */}
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-sidebar-foreground truncate">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
              </SidebarMenuItem>

              {/* Tools Section */}
              <SidebarMenuItem>
                <div className="px-2 pt-4 pb-2">
                  <span className="text-xs font-semibold text-muted-foreground">TOOLS</span>
                </div>
              </SidebarMenuItem>
              {toolsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={location.pathname === item.url}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* History Section */}
              <SidebarMenuItem>
                <div className="px-2 pt-4 pb-2">
                  <span className="text-xs font-semibold text-muted-foreground">HISTORY</span>
                </div>
              </SidebarMenuItem>
              {historyMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={location.pathname === item.url}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Secondary Menu Items */}
              {secondaryMenuItems.map((item) => {
                // Skip rendering if showWhen condition is defined and returns false
                if (item.showWhen && !item.showWhen(subscriptionStatus)) {
                  return null;
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={item.onClick || (item.url ? () => navigate(item.url) : undefined)}
                      isActive={item.url ? location.pathname === item.url : false}
                      className={item.className}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Sign Out Button */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Crafted with love by VyralSearch */}
              <SidebarMenuItem>
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  Crafted with ❤️ by VyralSearch
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}