import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
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
    <div className="px-2 py-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/70">
        <Activity className="h-3.5 w-3.5" />
        <span>Daily Usage</span>
      </div>

      {/* Progress and Stats */}
      <div className="space-y-1.5">
        <Progress 
          value={usagePercentage} 
          className="h-1.5 bg-sidebar-accent/20"
        />
        
        <div className="flex justify-between text-[10px] text-sidebar-foreground/60">
          <span>{usedRequests}/{maxRequests}</span>
          <span>{remainingRequests} left</span>
        </div>
      </div>
    </div>
  );
};