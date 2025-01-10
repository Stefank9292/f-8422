import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarSettings } from "./sidebar/SidebarSettings";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { RequestUsageCounter } from "./RequestUsageCounter";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Always keep sidebar open on desktop when there's a session
  useEffect(() => {
    if (session) {
      setOpen(true);
    }
  }, [session, setOpen]);

  const { data: subscriptionStatus } = useSubscription(session);

  const handleSignOut = async () => {
    try {
      // First invalidate all queries to clear the cache
      queryClient.clear();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local storage except for specific items
      const authData = window.localStorage.getItem('supabase.auth.token');
      window.localStorage.clear();
      if (authData) {
        window.localStorage.setItem('supabase.auth.token', authData);
      }

      // Show success message
      toast({
        description: "Successfully signed out",
      });

      // Navigate to auth page
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  // Handle loading state
  if (isSessionLoading) {
    return null;
  }

  // If there's no session after loading, don't render the sidebar
  if (!session) {
    return null;
  }

  return (
    <Sidebar className="z-30">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col h-full">
            <div className="space-y-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarNavigation />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarTools currentPath={location.pathname} />
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="mt-auto space-y-2">
              <SidebarMenu>
                {/* Only show subscription-dependent items if there's a subscription */}
                {subscriptionStatus?.subscribed && (
                  <>
                    <SidebarMenuItem>
                      <SidebarSettings 
                        currentPath={location.pathname}
                        subscriptionStatus={subscriptionStatus}
                      />
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <RequestUsageCounter />
                    </SidebarMenuItem>
                  </>
                )}

                {/* Always show sign out button if there's a session */}
                <SidebarMenuItem>
                  <div className="px-2 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-2 py-1 rounded-full flex items-center justify-center gap-1.5 text-[10px] text-sidebar-foreground/70 hover:bg-sidebar-accent/20 transition-colors"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarFooter />
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}