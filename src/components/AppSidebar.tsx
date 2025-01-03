import { Home, CreditCard, Ban, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";
import { Badge } from "@/components/ui/badge";
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
  {
    title: "Subscribe",
    url: "/subscribe",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
  });

  const getPlanBadgeText = () => {
    const planName = subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" ? "Ultra" : "Premium";
    return subscriptionStatus?.canceled 
      ? `${planName} (Cancels at end of period)` 
      : `${planName} Active`;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}