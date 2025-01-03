import { MagnifyingGlass, CreditCard, LogOut, User, Moon, HelpCircle, MessageCircle, PanelLeftClose } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
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

const menuItems = [
  {
    title: "VyralSearch",
    url: "/",
    icon: MagnifyingGlass,
  },
];

const secondaryMenuItems = [
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

  const getPlanBadgeText = () => {
    const planName = subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" ? "Ultra" : "Premium";
    return subscriptionStatus?.canceled 
      ? `${planName} (Cancels at end of period)` 
      : `${planName}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const getSubscriptionButtonText = () => {
    if (subscriptionStatus?.subscribed) {
      return "Manage Subscription";
    }
    return "Upgrade to Pro";
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
                    {subscriptionStatus?.subscribed && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {getPlanBadgeText()}
                      </Badge>
                    )}
                  </div>
                </div>
              </SidebarMenuItem>

              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={location.pathname === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/subscribe")}
                  isActive={location.pathname === "/subscribe"}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{getSubscriptionButtonText()}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Secondary Menu Items */}
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={item.onClick || (item.url ? () => navigate(item.url) : undefined)}
                    isActive={item.url ? location.pathname === item.url : false}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

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
