import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { PlanButtonText } from "./subscription/PlanButtonText";
import { useSubscriptionAction } from "@/hooks/useSubscriptionAction";

export interface SubscribeButtonProps {
  planId: string;
  planName: string;
  isPopular?: boolean;
  isAnnual: boolean;
}

export const SubscribeButton = ({ planId, planName, isPopular, isAnnual }: SubscribeButtonProps) => {
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

  const { loading, handleSubscriptionAction } = useSubscriptionAction(session);

  const getButtonText = () => {
    if (!subscriptionStatus?.subscribed) {
      if (isAnnual && planId === "price_1Qdt3tGX13ZRG2XiesasShEJ") {
        return "Save 20% with annual";
      }
      if (isAnnual && planId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") {
        return "Save 20% with annual";
      }
      return `Upgrade to ${planName}`;
    }

    const isCurrentPlan = subscriptionStatus?.priceId === planId;
    if (isCurrentPlan) {
      return "Current Plan";
    }

    const isMonthlyToAnnualUpgrade = isAnnual && 
      ((subscriptionStatus?.priceId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu" && planId === "price_1Qdt3tGX13ZRG2XiesasShEJ") || 
       (subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" && planId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk"));

    if (isMonthlyToAnnualUpgrade) {
      return "Save 20% with annual";
    }

    if (subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" && planId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu") {
      return "Downgrade to Creator Pro";
    }

    return `Upgrade to ${planName}`;
  };

  const isCurrentPlan = subscriptionStatus?.subscribed && subscriptionStatus.priceId === planId;

  const isDowngrade = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" && 
                     planId === "price_1Qdt2dGX13ZRG2XiaKwG6VPu";

  const getButtonStyle = () => {
    if (isPopular) {
      return "primary-gradient";
    }
    if (isDowngrade) {
      return "bg-gray-500 hover:bg-gray-600 text-white";
    }
    return "bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white";
  };

  if (isCurrentPlan) {
    return (
      <CancelSubscriptionButton 
        isCanceled={subscriptionStatus?.canceled}
        className="w-full"
      >
        Cancel Subscription
      </CancelSubscriptionButton>
    );
  }

  const handleClick = () => handleSubscriptionAction(planId, planName, subscriptionStatus);

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading || isCurrentPlan}
      className={`w-full text-[11px] h-8 ${getButtonStyle()}`}
      variant={isPopular ? "default" : "secondary"}
    >
      <PlanButtonText 
        text={loading ? "Loading..." : getButtonText()}
        isUpgrade={!isCurrentPlan}
        showThunderbolt={isAnnual && planId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk"}
      />
    </Button>
  );
};