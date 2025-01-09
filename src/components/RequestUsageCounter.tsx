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
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        throw error;
      }
      return session;
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

  const { data: subscriptionStatus, error: subscriptionError } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        console.log('No session token available');
        return null;
      }

      try {
        console.log('Checking subscription with token:', session.access_token.slice(0, 10) + '...');
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) {
          console.error('Subscription check error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Failed to check subscription:', error);
        throw error;
      }
    },
    enabled: !!session?.access_token,
    retry: false,
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
          queryClient.invalidateQueries({ queryKey: ['request-stats'] });
          
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

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast]);

  if (subscriptionError) {
    console.error('Subscription error:', subscriptionError);
    return null;
  }

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