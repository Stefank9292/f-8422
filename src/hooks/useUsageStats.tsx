import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";

export const useUsageStats = (session: Session | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requestStats, refetch: refetchRequestStats } = useQuery({
    queryKey: ['request-stats'],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { count, error } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('request_type', 'instagram_search')
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString());

      if (error) {
        console.error('Error fetching request stats:', error);
        toast({
          title: "Error",
          description: "Failed to fetch usage statistics",
          variant: "destructive",
        });
        return 0;
      }

      return count || 0;
    },
    enabled: !!session?.user.id,
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    const checkAndResetMonthlyUsage = async () => {
      if (!session?.user.id || !subscriptionStatus) return;

      const isSteroidsUser = subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                            subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
      
      if (!isSteroidsUser) {
        const now = new Date();
        const lastResetDate = new Date(now);
        lastResetDate.setDate(lastResetDate.getDate() - 30);

        const { data: requests, error } = await supabase
          .from('user_requests')
          .select('last_reset_at')
          .eq('user_id', session.user.id)
          .eq('request_type', 'instagram_search')
          .order('last_reset_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error checking last reset date:', error);
          return;
        }

        const shouldReset = !requests?.[0]?.last_reset_at || 
                          new Date(requests[0].last_reset_at) < lastResetDate;

        if (shouldReset) {
          const { error: resetError } = await supabase
            .from('user_requests')
            .update({ last_reset_at: now.toISOString() })
            .eq('user_id', session.user.id)
            .eq('request_type', 'instagram_search')
            .lt('created_at', lastResetDate.toISOString());

          if (resetError) {
            console.error('Error resetting usage:', resetError);
            return;
          }

          await refetchRequestStats();
        }
      }
    };

    checkAndResetMonthlyUsage();
  }, [session?.user.id, subscriptionStatus, refetchRequestStats]);

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";
  const isProUser = subscriptionStatus?.priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || 
                   subscriptionStatus?.priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ";
  
  const maxRequests = isSteroidsUser ? Infinity : (isProUser ? 25 : 3);
  const usedRequests = requestStats || 0;
  const remainingRequests = isSteroidsUser ? Infinity : Math.max(0, maxRequests - usedRequests);
  const usagePercentage = isSteroidsUser ? 0 : ((usedRequests / maxRequests) * 100);
  const hasReachedLimit = isSteroidsUser ? false : usedRequests >= maxRequests;

  const getPlanName = () => {
    if (subscriptionStatus?.priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" || 
        subscriptionStatus?.priceId === "price_1Qdt3tGX13ZRG2XiesasShEJ") {
      return 'Creator Pro';
    }
    if (subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") {
      return 'Creator on Steroids';
    }
    return 'Free Plan';
  };

  return {
    isSteroidsUser,
    isProUser,
    maxRequests,
    usedRequests,
    remainingRequests,
    usagePercentage,
    hasReachedLimit,
    getPlanName,
    subscriptionStatus,
  };
};