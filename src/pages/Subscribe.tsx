import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionOverview } from "@/components/subscription/SubscriptionOverview";

const SubscribePage = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
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

  const { data: requestStats } = useQuery({
    queryKey: ['request-stats'],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const now = new Date();
      const { data, error } = await supabase
        .from('user_requests')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('period_end', now.toISOString())
        .order('period_end', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const maxClicks = subscriptionStatus?.maxClicks || 3;
  const usedClicks = requestStats?.length || 0;
  const remainingClicks = Math.max(0, maxClicks - usedClicks);
  const planName = subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" ? "Creator on Steroids" : 
                  subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq" ? "Creator Pro" : 
                  "Free";

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-12 pt-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Manage Subscription</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            View your current plan details and manage your subscription settings
          </p>
        </div>

        {session && (
          <div className="max-w-3xl mx-auto">
            <SubscriptionOverview
              planName={planName}
              usedClicks={usedClicks}
              remainingClicks={remainingClicks}
              maxClicks={maxClicks}
              isCanceled={subscriptionStatus?.canceled}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribePage;