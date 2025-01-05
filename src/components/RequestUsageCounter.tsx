import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Activity, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, Link } from "react-router-dom";

export const RequestUsageCounter = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: requestStats, refetch: refetchRequestStats } = useQuery({
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

  useEffect(() => {
    if (!session?.user.id) return;

    const channel = supabase
      .channel('user-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_requests',
          filter: `user_id=eq.${session.user.id}`,
        },
        async () => {
          await refetchRequestStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user.id, refetchRequestStats]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const isUltraPlan = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                      subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
  const isProPlan = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
                    subscriptionStatus?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";
  const maxRequests = isUltraPlan ? Infinity : (isProPlan ? 25 : 3);
  const usedRequests = requestStats || 0;
  const remainingRequests = isUltraPlan ? Infinity : Math.max(0, maxRequests - usedRequests);
  const usagePercentage = isUltraPlan ? 0 : ((usedRequests / maxRequests) * 100);
  const hasReachedLimit = usedRequests >= maxRequests;

  const getPlanName = () => {
    if (!subscriptionStatus?.subscribed) return 'Free';
    if (subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
        subscriptionStatus.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") {
      return 'Creator Pro';
    }
    if (subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
        subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0") {
      return 'Creator on Steroids';
    }
    return 'Free';
  };

  return (
    <div className="px-2 py-2 space-y-4 flex flex-col items-center">
      <div className="w-full flex flex-col items-center space-y-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[11px] text-sidebar-foreground/70 text-center truncate max-w-[150px]">
            {session?.user?.email}
          </span>
          <span className="text-[10px] text-sidebar-foreground/50">
            {getPlanName()} Plan
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-1 px-2 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-sidebar-foreground/70 hover:bg-sidebar-accent/20 transition-colors"
        >
          <LogOut className="h-3 w-3" />
          <span>Sign out</span>
        </button>
      </div>

      <div className="w-full h-px bg-sidebar-border my-2" />

      <div className="space-y-1.5 w-full text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-sidebar-foreground/70">
          <Activity className="h-3 w-3" />
          <span>Monthly Usage</span>
        </div>

        <div className="space-y-1">
          {isUltraPlan ? (
            <div className="text-[9px] text-sidebar-foreground/60 flex items-center justify-center gap-1">
              <span>Unlimited Usage</span>
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
    </div>
  );
};