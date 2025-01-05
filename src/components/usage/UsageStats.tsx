import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const UsageStats = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: requestStats } = useQuery({
    queryKey: ['request-stats'],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { count } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('request_type', 'instagram_search')
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString());

      return count || 0;
    },
    enabled: !!session?.user.id,
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

  const isUltraPlan = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                      subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
  const isProPlan = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
                    subscriptionStatus?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";
  const maxRequests = isUltraPlan ? Infinity : (isProPlan ? 25 : 3);
  const usedRequests = requestStats || 0;
  const remainingRequests = isUltraPlan ? Infinity : Math.max(0, maxRequests - usedRequests);
  const usagePercentage = isUltraPlan ? 0 : ((usedRequests / maxRequests) * 100);
  const hasReachedLimit = usedRequests >= maxRequests;

  return (
    <div className="space-y-1.5 w-full text-center">
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-sidebar-foreground/70">
        <Activity className="h-3 w-3" />
        <span>Monthly Usage</span>
      </div>

      <div className="space-y-1">
        {isUltraPlan ? (
          <div className="text-[9px] text-sidebar-foreground/60 flex items-center justify-center gap-1">
            <span className="bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
              Unlimited Usage
            </span>
            <span className="text-green-500">•</span>
            <span>{usedRequests} requests this month</span>
          </div>
        ) : (
          <>
            <Progress 
              value={usagePercentage} 
              className="h-1 bg-sidebar-accent/20"
            />
            <div className="flex justify-between text-[9px] text-sidebar-foreground/60">
              <span>{usedRequests}/{maxRequests}</span>
              <span>{remainingRequests} left</span>
            </div>
            {hasReachedLimit && !isUltraPlan && (
              <Link 
                to="/subscribe" 
                className="text-[9px] text-primary hover:text-primary/80 transition-colors mt-1 inline-block"
              >
                Upgrade plan for more searches →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};