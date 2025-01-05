import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
  });

  const isUnlimitedPlan = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                         subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";

  return (
    <div className="space-y-2 py-2">
      <div className={cn("flex items-center justify-between px-4 py-2", isCollapsed ? "h-auto" : "h-[40px]")}>
        <span className={cn("text-sm font-medium transition-all duration-200", isCollapsed ? "opacity-0 hidden" : "opacity-100")}>
          Navigation
        </span>
      </div>
      <nav className="space-y-1 px-2">
        {!isUnlimitedPlan && (
          <Link 
            to="/subscribe" 
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-sidebar-accent/20"
          >
            <Crown className="h-4 w-4 animate-synchronized-pulse" />
            <span className="instagram-gradient bg-clip-text text-transparent animate-synchronized-pulse">
              Upgrade to Creator on Steroids
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}