import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
}

export const SubscribeButton = ({ planId, planName }: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
  });

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      if (planId === 'free') {
        const { error } = await supabase.functions.invoke('cancel-subscription');
        if (error) throw error;
        
        toast({
          title: "Plan Updated",
          description: "You have been successfully downgraded to the Free plan.",
        });
      } else {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: { priceId: planId }
        });
        
        if (error) throw error;
        
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
      }

      // Invalidate the subscription status query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (!subscriptionStatus?.subscribed && planId !== 'free') {
      return `Subscribe to ${planName}`;
    }

    if (planId === 'free') {
      if (!subscriptionStatus?.subscribed) {
        return "Current Plan";
      }
      return "Downgrade to Free";
    }

    const isCurrentPlan = subscriptionStatus?.priceId === planId;
    if (isCurrentPlan) {
      return "Current Plan";
    }

    // If user has Ultra plan (viewing Premium button)
    if (subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" && planId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      return "Downgrade to Premium";
    }

    return `Upgrade to ${planName}`;
  };

  const isCurrentPlan = 
    (planId === 'free' && !subscriptionStatus?.subscribed) || 
    (subscriptionStatus?.subscribed && subscriptionStatus.priceId === planId);

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={loading || isCurrentPlan}
      className="w-full"
      variant={isCurrentPlan ? "secondary" : "default"}
    >
      {loading ? "Loading..." : getButtonText()}
    </Button>
  );
};