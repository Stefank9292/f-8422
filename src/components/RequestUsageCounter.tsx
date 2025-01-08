import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileInfo } from "./profile/UserProfileInfo";
import { useUsageStats } from "@/hooks/useUsageStats";

export const RequestUsageCounter = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const {
    isSteroidsUser,
    isProUser,
    maxRequests,
    usedRequests,
    remainingRequests,
    usagePercentage,
    hasReachedLimit,
    getPlanName,
  } = useUsageStats(session);

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
  });

  if (!subscriptionStatus?.subscribed) {
    return null;
  }

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