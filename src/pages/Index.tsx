import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  // Fetch subscription status and click limit
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        throw new Error('Authentication error');
      }
      
      if (!session?.user?.email) {
        console.error('No authenticated session found');
        navigate('/auth');
        throw new Error('No authenticated session found');
      }

      const { data, error: functionError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      return data;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Subscription check error:', error);
        toast({
          title: "Error checking subscription",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    }
  });

  // Fetch user's current click count
  const { data: userClicks, refetch: refetchClicks } = useQuery({
    queryKey: ['user-clicks'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('No authenticated session found');

      const now = new Date();
      const { data, error } = await supabase
        .from('user_clicks')
        .select('*')
        .eq('user_id', session.user.id)
        .lte('period_start', now.toISOString())
        .gte('period_end', now.toISOString())
        .maybeSingle();

      if (error) {
        console.error('Error fetching clicks:', error);
        throw error;
      }

      // If no current period exists, create one
      if (!data) {
        const periodStart = new Date();
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1); // One month period

        const { data: newPeriod, error: insertError } = await supabase
          .from('user_clicks')
          .insert({
            user_id: session.user.id,
            click_count: 0,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newPeriod;
      }

      return data;
    }
  });

  const getClickLimit = () => {
    if (!subscriptionStatus) return 3; // Default to free plan limit
    return subscriptionStatus.maxClicks || 3;
  };

  const handleClick = async () => {
    const clickLimit = getClickLimit();
    const currentCount = userClicks?.click_count || 0;

    if (currentCount < clickLimit) {
      try {
        if (!userClicks?.id) {
          await refetchClicks();
          return;
        }

        const newCount = currentCount + 1;
        const { error } = await supabase
          .from('user_clicks')
          .update({ click_count: newCount })
          .eq('id', userClicks.id);

        if (error) throw error;

        await refetchClicks();
        
        toast({
          title: "Crown clicked!",
          description: `You have ${clickLimit - newCount} clicks remaining.`,
        });
      } catch (error) {
        console.error('Error updating click count:', error);
        toast({
          title: "Error",
          description: "Failed to update click count",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Click limit reached",
        description: `You have reached the maximum number of clicks (${clickLimit}) for this period.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome to the App</h1>
        
        <div className="space-y-2">
          <p>You have used {userClicks?.click_count || 0} clicks this period</p>
          <p>Your current limit is: {getClickLimit()} clicks</p>
          {userClicks && (
            <p className="text-sm text-gray-600">
              Period ends: {new Date(userClicks.period_end).toLocaleDateString()}
            </p>
          )}
          
          <button
            onClick={handleClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
          >
            Click me!
          </button>
        </div>

        {subscriptionStatus?.subscribed ? (
          <div className="p-4 bg-green-100 rounded">
            <p>You are subscribed! 🎉</p>
            {subscriptionStatus.canceled && (
              <p className="text-yellow-600">Your subscription will end at the end of the current period</p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 rounded">
            <p>You are on the Free plan</p>
            <button
              onClick={() => navigate('/subscribe')}
              className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            >
              Upgrade now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;