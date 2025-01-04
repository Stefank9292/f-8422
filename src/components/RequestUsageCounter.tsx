import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Activity, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { count } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const maxRequests = subscriptionStatus?.maxClicks || 25;
  const usedRequests = requestStats || 0;
  const remainingRequests = Math.max(0, maxRequests - usedRequests);
  const usagePercentage = (usedRequests / maxRequests) * 100;

  const getPlanName = () => {
    if (!subscriptionStatus?.subscribed) return 'Free';
    if (subscriptionStatus.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") return 'Creator Pro';
    if (subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") return 'Creator on Steroids';
    return 'Free';
  };

  return (
    <div className="px-2 py-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback>
              <User className="h-3.5 w-3.5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[11px] text-sidebar-foreground/70 truncate">
              {session?.user?.email}
            </span>
            <span className="text-[10px] text-sidebar-foreground/50">
              {getPlanName()} Plan
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-sidebar-accent/20 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5 text-sidebar-foreground/70" />
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-sidebar-foreground/70">
          <Activity className="h-3 w-3" />
          <span>Daily Usage</span>
        </div>

        <div className="space-y-1">
          <Progress 
            value={usagePercentage} 
            className="h-1 bg-sidebar-accent/20"
          />
          
          <div className="flex justify-between text-[9px] text-sidebar-foreground/60">
            <span>{usedRequests}/{maxRequests}</span>
            <span>{remainingRequests} left</span>
          </div>
        </div>
      </div>
    </div>
  );
};