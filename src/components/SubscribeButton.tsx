import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
}

export const SubscribeButton = ({ planId, planName }: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId: planId }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (!subscriptionStatus?.subscribed) {
      return `Subscribe to ${planName}`;
    }

    const isCurrentPlan = subscriptionStatus.priceId === planId;
    if (isCurrentPlan) {
      return "Current Plan";
    }

    // If user has Ultra plan (viewing Premium button)
    if (subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" && planId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      return "Downgrade to Premium";
    }

    return `Upgrade to ${planName}`;
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={loading || (subscriptionStatus?.subscribed && subscriptionStatus.priceId === planId)}
      className="w-full"
      variant={subscriptionStatus?.priceId === planId ? "secondary" : "default"}
    >
      {loading ? "Loading..." : getButtonText()}
    </Button>
  );
};