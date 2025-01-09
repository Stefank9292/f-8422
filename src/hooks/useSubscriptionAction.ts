import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionAction = (session: any) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resetSearchUsage = async (userId: string, fromPlan: string | null, toPlan: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { count } = await supabase
      .from('user_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('request_type', 'instagram_search')
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', endOfMonth.toISOString());

    const currentUsage = count || 0;
    const isFromUnlimited = fromPlan === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
                           fromPlan === "price_1QdtyHGX13ZRG2Xib8px0lu0";
    const isToFreePlan = toPlan === 'free';
    const shouldResetUsage = isFromUnlimited || (!isToFreePlan && currentUsage > 3);

    if (shouldResetUsage) {
      await supabase
        .from('user_requests')
        .update({ last_reset_at: new Date().toISOString() })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString());
    }
  };

  const handleSubscriptionAction = async (
    planId: string,
    planName: string,
    subscriptionStatus: any
  ) => {
    try {
      setLoading(true);
      
      if (!session?.user.id) {
        throw new Error('No authenticated user found');
      }

      if (planId === 'free') {
        const { error } = await supabase.functions.invoke('cancel-subscription', {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        if (error) throw error;
        
        toast({
          title: "Plan Updated",
          description: "Your subscription has been cancelled and you have been moved to the Free plan.",
        });
      } 
      else if (planId === "price_1QdtwnGX13ZRG2XihcM36r3W" && 
               subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW") {
        const { error } = await supabase.functions.invoke('update-subscription', {
          body: { priceId: planId },
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        
        if (error) throw error;
        await resetSearchUsage(session.user.id, subscriptionStatus.priceId, planId);
        
        toast({
          title: "Plan Updated",
          description: "You have been successfully downgraded to the Creator Pro plan.",
        });
      }
      else {
        console.log('Creating checkout session for plan:', planId);
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: { priceId: planId },
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        
        if (error) {
          console.error('Checkout session error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No response data received from checkout session creation');
        }

        console.log('Checkout session response:', data);

        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.url) {
          throw new Error('No checkout URL returned');
        }

        window.location.href = data.url;
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    } catch (error: any) {
      console.error('Subscription action error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubscriptionAction
  };
};