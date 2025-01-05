import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfileInfo } from "./profile/UserProfileInfo";

export const RequestUsageCounter = () => {
  const { toast } = useToast();
  
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

      // Get requests that haven't been reset
      const { count } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('request_type', 'instagram_search')
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString())
        .or(`last_reset_at.is.null,last_reset_at.lt.${startOfMonth.toISOString()}`);

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

  // Check and reset monthly usage if needed
  useEffect(() => {
    const checkAndResetMonthlyUsage = async () => {
      if (!session?.user.id || !subscriptionStatus) return;

      const isSteroidsUser = subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                            subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
      
      if (!isSteroidsUser) {
        const now = new Date();
        const lastResetDate = new Date(now);
        lastResetDate.setDate(lastResetDate.getDate() - 30);

        const { data: requests } = await supabase
          .from('user_requests')
          .select('last_reset_at')
          .eq('user_id', session.user.id)
          .eq('request_type', 'instagram_search')
          .order('last_reset_at', { ascending: false })
          .limit(1);

        const shouldReset = !requests?.[0]?.last_reset_at || 
                          new Date(requests[0].last_reset_at) < lastResetDate;

        if (shouldReset) {
          await supabase
            .from('user_requests')
            .update({ last_reset_at: now.toISOString() })
            .eq('user_id', session.user.id)
            .eq('request_type', 'instagram_search')
            .lt('created_at', lastResetDate.toISOString());

          await refetchRequestStats();
        }
      }
    };

    checkAndResetMonthlyUsage();
  }, [session?.user.id, subscriptionStatus, refetchRequestStats]);

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                        subscriptionStatus?.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0";
  const isProUser = subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
                    subscriptionStatus?.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV";
  
  // Updated logic for request limits
  const maxRequests = isSteroidsUser ? Infinity : (isProUser ? 25 : 3);
  const usedRequests = requestStats || 0;
  const remainingRequests = isSteroidsUser ? Infinity : Math.max(0, maxRequests - usedRequests);
  const usagePercentage = isSteroidsUser ? 0 : ((usedRequests / maxRequests) * 100);
  const hasReachedLimit = isSteroidsUser ? false : usedRequests >= maxRequests;

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
    <div className="px-2 py-2">
      <UserProfileInfo
        email={session?.user?.email}
        planName={getPlanName()}
        isSteroidsUser={isSteroidsUser}
        isProUser={isProUser}
        isUltraPlan={isSteroidsUser}
        usagePercentage={usagePercentage}
        usedRequests={usedRequests}
        maxRequests={maxRequests}
        remainingRequests={remainingRequests}
        hasReachedLimit={hasReachedLimit}
      />
    </div>
  );
};
