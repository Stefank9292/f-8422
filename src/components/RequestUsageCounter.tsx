import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserProfileInfo } from "./profile/UserProfileInfo";
import { UsageProgress } from "./profile/UsageProgress";

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

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                         subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
  const isProUser = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
                    subscriptionStatus?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";

  return (
    <div className="px-2 py-2 space-y-4 flex flex-col items-center">
      <UserProfileInfo
        email={session?.user?.email}
        planName={getPlanName()}
        isSteroidsUser={isSteroidsUser}
        isProUser={isProUser}
        onSignOut={handleSignOut}
      />

      <div className="w-full h-px bg-sidebar-border my-2" />

      <UsageProgress
        isUltraPlan={isUltraPlan}
        usagePercentage={usagePercentage}
        usedRequests={usedRequests}
        maxRequests={maxRequests}
        remainingRequests={remainingRequests}
        hasReachedLimit={hasReachedLimit}
      />
    </div>
  );
};