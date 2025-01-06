import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap } from "lucide-react";
import { getButtonText, getButtonVariant } from "./subscription/ButtonTextHelper";
import { isCurrentPlan, isSubscriptionCanceled, canUpgradeOrDowngrade } from "./subscription/SubscriptionHelper";

interface SubscribeButtonProps {
  planId: string;
  isAnnual?: boolean;
}

export const SubscribeButton = ({ planId, isAnnual = false }: SubscribeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const handleSubscribe = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId: planId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = getButtonText(planId, subscriptionStatus, isLoading);
  const buttonVariant = getButtonVariant(planId, subscriptionStatus);
  const showButton = !isCurrentPlan(planId, subscriptionStatus) || 
                    isSubscriptionCanceled(subscriptionStatus) ||
                    canUpgradeOrDowngrade(planId, subscriptionStatus);

  if (!showButton) return null;

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      variant={buttonVariant}
      className="w-full h-10 text-[11px] font-medium"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isAnnual ? (
        <Zap className="mr-2 h-4 w-4" />
      ) : null}
      {buttonText}
    </Button>
  );
};