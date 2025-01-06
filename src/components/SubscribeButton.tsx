import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { PlanButtonText } from "./subscription/PlanButtonText";
import { useSubscriptionAction } from "@/hooks/useSubscriptionAction";

interface SubscribeButtonProps {
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

  const { loading, handleSubscriptionAction } = useSubscriptionAction(session);

  const getButtonText = () => {
    if (!subscriptionStatus?.subscribed && planId !== 'free') {
      if (isAnnual && planId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") {
        return "Upgrade to Creator Pro Annual";
      }
      if (isAnnual && planId === "price_1QdtyHGX13ZRG2Xib8px0lu0") {
        return "For Viral Marketing Gods";
      }
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

    const isMonthlyToAnnualUpgrade = isAnnual && 
      ((subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" && planId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") || 
       (subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtyHGX13ZRG2Xib8px0lu0"));

    if (isMonthlyToAnnualUpgrade) {
      return "Save 20% with annual";
    }

    if (subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtwnGX13ZRG2XihcM36r3W") {
      return "Downgrade to Creator Pro";
    }

    return `Upgrade to ${planName}`;
  };

  const isCurrentPlan = 
    (planId === 'free' && !subscriptionStatus?.subscribed) || 
    (subscriptionStatus?.subscribed && subscriptionStatus.priceId === planId);

  const isDowngrade = 
    (planId === 'free' && subscriptionStatus?.subscribed) || 
    (subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtwnGX13ZRG2XihcM36r3W");

  const getButtonStyle = () => {
    // Keep gradient only for popular plan
    if (isPopular) {
      return "primary-gradient";
    }
    // Apply subtle grey for downgrade state, navy blue for other states
    if (isDowngrade) {
      return "bg-gray-500 hover:bg-gray-600 text-white";
    }
    // Apply solid navy blue for free and pro plans (upgrade state)
    return "bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white";
  };

  if (isCurrentPlan && subscriptionStatus?.subscribed && planId !== 'free') {
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
      disabled={loading || (isCurrentPlan && planId === 'free')}
      className={`w-full text-[11px] h-8 ${getButtonStyle()}`}
      variant={isPopular ? "default" : "secondary"}
    >
      <PlanButtonText 
        text={loading ? "Loading..." : getButtonText()}
        isUpgrade={!isCurrentPlan && planId !== 'free'}
        showThunderbolt={isAnnual && planId === "price_1QdtyHGX13ZRG2Xib8px0lu0"}
      />
    </Button>
  );
};