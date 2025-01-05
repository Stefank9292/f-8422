import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
  isPopular?: boolean;
  isAnnual: boolean;
}

export const SubscribeButton = ({ planId, planName, isPopular, isAnnual }: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Handle downgrade to free plan
      if (planId === 'free') {
        const { error } = await supabase.functions.invoke('cancel-subscription', {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });
        if (error) throw error;
        
        toast({
          title: "Plan Updated",
          description: "Your subscription has been cancelled and you have been moved to the Free plan immediately.",
        });
      } 
      // Handle downgrade to Creator Pro from Creator on Steroids
      else if (planId === "price_1QdBd2DoPDXfOSZFnG8aWuIq" && subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") {
        const { error } = await supabase.functions.invoke('update-subscription', {
          body: { priceId: planId },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Plan Updated",
          description: "You have been successfully downgraded to the Creator Pro plan.",
        });
      }
      // Handle upgrades through checkout
      else {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: { priceId: planId },
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
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
      return `Upgrade to ${planName}`;
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

    // Check if user has monthly subscription and this is the annual version of their plan
    const isMonthlyToAnnualUpgrade = isAnnual && 
      ((subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq" && planId === "price_1QdHTrDoPDXfOSZFhVlGuUAd") || // Pro monthly to annual
       (subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" && planId === "price_1QdHUGDoPDXfOSZFGaGscfw5")); // Steroids monthly to annual

    if (isMonthlyToAnnualUpgrade) {
      return "Save 20% now by upgrading to annual";
    }

    // If user has Creator on Steroids plan (viewing Creator Pro button)
    if (subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" && planId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") {
      return "Downgrade to Creator Pro";
    }

    // If user has Creator Pro plan (viewing Creator on Steroids button)
    if (subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq" && planId === "price_1QdC54DoPDXfOSZFXHBO4yB3") {
      return "Upgrade to Creator on Steroids";
    }

    return `Upgrade to ${planName}`;
  };

  const isCurrentPlan = 
    (planId === 'free' && !subscriptionStatus?.subscribed) || 
    (subscriptionStatus?.subscribed && subscriptionStatus.priceId === planId);

  const getButtonStyle = () => {
    if (isCurrentPlan) {
      return "bg-secondary hover:bg-secondary/80";
    }
    
    if (isPopular) {
      return "primary-gradient text-primary-foreground";
    }
    
    // Navy blue for free plan button
    if (planId === 'free') {
      return "bg-[#1a365d] hover:bg-[#1a365d]/90 text-white";
    }
    
    // Solid color for Creator Pro plan
    return "bg-[#222226] hover:bg-[#222226]/90 text-white";
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={loading || isCurrentPlan}
      className={`w-full text-[11px] h-8 ${getButtonStyle()}`}
      variant={isCurrentPlan ? "secondary" : "default"}
    >
      {loading ? "Loading..." : getButtonText()}
    </Button>
  );
};