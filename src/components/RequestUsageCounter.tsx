import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { data, error } = await supabase
        .from('user_requests')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('period_start', startOfDay.toISOString())
        .lt('period_end', endOfDay.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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

    // Subscribe to changes in the user_requests table
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
        async (payload) => {
          console.log('User requests updated:', payload);
          await refetchRequestStats();
          
          // Show a toast notification when usage is updated
          toast({
            title: "Usage Updated",
            description: "Your request usage has been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user.id, refetchRequestStats, toast]);

  const maxRequests = subscriptionStatus?.maxClicks || 3; // Default to free tier
  const usedRequests = requestStats?.length || 0;
  const remainingRequests = Math.max(0, maxRequests - usedRequests);
  const usagePercentage = (usedRequests / maxRequests) * 100;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Request Usage</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{usedRequests} used</span>
          <span>{remainingRequests} remaining</span>
        </div>
        <Progress value={usagePercentage} className="h-2" />
        <p className="text-sm text-muted-foreground">
          Total requests: {maxRequests} per day
        </p>
      </div>
    </Card>
  );
};