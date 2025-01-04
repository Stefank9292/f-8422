import { Search, CreditCard, LogOut, Moon, HelpCircle, MessageCircle, PanelLeftClose, History, BarChart2, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/use-subscription";
import { useEffect } from "react";
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
];

const historyMenuItems = [
  {
    title: "Recent Searches",
    url: "/history",
    icon: History,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { toggleSidebar, state, setOpen } = useSidebar();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        throw error;
      }
      return session;
    },
  });

  const { data: subscriptionStatus } = useSubscription(session);

  // Auto-collapse timer
  useEffect(() => {
    let collapseTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(collapseTimer);
      if (state === 'expanded') {
        collapseTimer = setTimeout(() => {
          setOpen(false);
        }, 10000); // 10 seconds
      }
    };

    // Reset timer on mouse movement within sidebar
    const handleMouseMove = () => {
      resetTimer();
    };

    // Add event listener to sidebar element
    const sidebarElement = document.querySelector('[data-sidebar="sidebar"]');
    if (sidebarElement) {
      sidebarElement.addEventListener('mousemove', handleMouseMove);
    }

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(collapseTimer);
      if (sidebarElement) {
        sidebarElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [state, setOpen]);

  // Handle loading state
  if (isSessionLoading) {
    return null;
  }

  // If there's no session after loading, don't render the sidebar
  if (!session) {
    return null;
  }

  const secondaryMenuItems = [
    {
      title: "Manage Subscription",
      icon: CreditCard,
      url: "/subscribe",
      showWhen: (subscriptionStatus: any) => subscriptionStatus?.subscribed,
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
    {
      title: "Sign Out",
      icon: LogOut,
      onClick: async () => {
        await supabase.auth.signOut();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate("/auth");
      },
    },
  ];

  return (
    <>
      <Sidebar className="z-30">
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

                {/* Settings Section */}
                <SidebarSection
                  title="SETTINGS"
                  items={secondaryMenuItems}
                  subscriptionStatus={subscriptionStatus}
                  onNavigate={navigate}
                  currentPath={location.pathname}
                />

                {/* User Profile */}
                <SidebarMenuItem>
                  <UserProfile email={session?.user?.email} />
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

      {/* External toggle button that appears when sidebar is collapsed */}
      <button
        onClick={toggleSidebar}
        className={`fixed left-4 top-4 z-50 p-2 rounded-md bg-background shadow-md hover:bg-accent transition-opacity ${
          state === 'collapsed' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <PanelLeftClose className="h-4 w-4 rotate-180" />
        <span className="sr-only">Open Sidebar</span>
      </button>
    </>
  );
}