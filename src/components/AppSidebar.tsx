import { Home, CreditCard, Ban, RefreshCw, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";
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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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
      : `${planName} Active`;
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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                  <span className="text-sm text-sidebar-foreground truncate">
                    {session?.user?.email}
                  </span>
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

              {subscriptionStatus?.subscribed && (
                <>
                  <SidebarMenuItem>
                    <div className="px-2">
                      <Badge variant="secondary" className="w-full justify-center text-sm">
                        {getPlanBadgeText()}
                      </Badge>
                    </div>
                  </SidebarMenuItem>
                  {subscriptionStatus.canceled ? (
                    <SidebarMenuItem>
                      <ResumeSubscriptionButton className="w-full justify-start gap-2 px-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Resume Subscription</span>
                      </ResumeSubscriptionButton>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem>
                      <CancelSubscriptionButton 
                        isCanceled={subscriptionStatus?.canceled}
                        className="w-full justify-start gap-2 px-2"
                      >
                        <Ban className="h-4 w-4" />
                        <span>Cancel Subscription</span>
                      </CancelSubscriptionButton>
                    </SidebarMenuItem>
                  )}
                </>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}