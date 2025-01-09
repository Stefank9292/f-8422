import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileInfo } from "./profile/UserProfileInfo";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useToast } from "@/hooks/use-toast";

export const RequestUsageCounter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      if (error) {
        console.error('Subscription check error:', error);
        return null;
      }
      return data;
    },
    enabled: !!session?.access_token,
    retry: 3,
    retryDelay: 1000,
  });

  // Set up real-time subscription for user_requests table
  useEffect(() => {
    if (!session?.user?.id) return;

    console.log('Setting up real-time subscription for user_requests');

    const channel = supabase
      .channel('user-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_requests',
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          // Invalidate the queries to trigger a refresh
          queryClient.invalidateQueries({ queryKey: ['request-stats'] });
          
          // Show a toast notification
          toast({
            title: "Usage Updated",
            description: "Your usage statistics have been updated.",
            duration: 3000,
          });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to real-time updates');
          toast({
            title: "Connection Error",
            description: "Failed to connect to real-time updates. Retrying...",
            variant: "destructive",
          });
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast]);

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