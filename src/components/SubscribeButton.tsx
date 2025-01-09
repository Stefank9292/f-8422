import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { PlanButtonText } from "./subscription/PlanButtonText";
import { useSubscriptionAction } from "@/hooks/useSubscriptionAction";
import { getButtonText, getButtonStyle } from "@/utils/subscription";

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

  const isCurrentPlan = subscriptionStatus?.subscribed && subscriptionStatus.priceId === planId;
  const isDowngrade = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" && 
                     planId === "price_1QfKMGGX13ZRG2XiFyskXyJo";

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
      className={`w-full text-[11px] h-8 ${getButtonStyle(!!isPopular, isDowngrade)}`}
      variant={isPopular ? "default" : "secondary"}
    >
      <PlanButtonText 
        text={loading ? "Loading..." : getButtonText(subscriptionStatus, planId, isAnnual, planName)}
        isUpgrade={!isCurrentPlan}
        showThunderbolt={isAnnual && planId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk"}
      />
    </Button>
  );
};