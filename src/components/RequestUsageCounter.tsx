import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";

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

  const maxRequests = subscriptionStatus?.maxClicks || 25;
  const usedRequests = requestStats?.length || 0;
  const remainingRequests = Math.max(0, maxRequests - usedRequests);
  const usagePercentage = (usedRequests / maxRequests) * 100;

  return (
    <Card className="bg-sidebar-accent p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-sidebar-foreground" />
          <h3 className="text-base font-semibold text-sidebar-foreground">Request Usage</h3>
        </div>

        {/* Usage Stats */}
        <div className="space-y-4">
          {/* Used and Remaining */}
          <div className="flex justify-between text-lg">
            <span className="text-sidebar-foreground">
              {usedRequests} used
            </span>
            <span className="text-sidebar-foreground">
              {remainingRequests} remaining
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="relative h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
            {/* Current Position Indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-primary transition-all duration-300"
              style={{ 
                left: `${usagePercentage}%`,
                transform: 'translateX(-50%)'
              }}
            />
            {/* Progress Bar */}
            <Progress 
              value={usagePercentage} 
              className="h-full bg-transparent"
            />
          </div>

          {/* Total */}
          <div className="pt-1">
            <p className="text-sm text-sidebar-foreground/70">
              Total requests: {maxRequests} per period
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};