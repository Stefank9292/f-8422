import { Search, CreditCard, LogOut, Moon, HelpCircle, MessageCircle, PanelLeftClose, History, BarChart2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserProfile } from "./sidebar/UserProfile";
import { SidebarSection } from "./sidebar/SidebarSection";

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
                <UserProfile email={session?.user?.email} />
              </SidebarMenuItem>

              {/* Tools Section */}
              <SidebarSection
                title="TOOLS"
                items={toolsMenuItems}
                onNavigate={navigate}
                currentPath={location.pathname}
              />

              {/* History Section */}
              <SidebarSection
                title="HISTORY"
                items={historyMenuItems}
                onNavigate={navigate}
                currentPath={location.pathname}
              />

              {/* Secondary Menu Section with separator */}
              <SidebarMenuItem>
                <div className="h-px bg-sidebar-border mx-2 my-4" />
              </SidebarMenuItem>

              {/* Secondary Menu Items */}
              <SidebarSection
                title="SETTINGS"
                items={secondaryMenuItems}
                subscriptionStatus={subscriptionStatus}
                onNavigate={navigate}
                currentPath={location.pathname}
              />

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