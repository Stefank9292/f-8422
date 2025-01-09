import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { PlanButtonText } from "./subscription/PlanButtonText";
import { useSubscriptionAction } from "@/hooks/useSubscriptionAction";
import { useToast } from "@/hooks/use-toast";

export interface SubscribeButtonProps {
  planId: string;
  planName: string;
  isPopular?: boolean;
  isAnnual: boolean;
}

// Price IDs for different environments
const PRICE_IDS = {
  development: {
    proMonthly: "price_1QdtwnGX13ZRG2XihcM36r3W",
    proAnnual: "price_1Qdtx2GX13ZRG2XieXrqPxAV",
    steroidsMonthly: "price_1Qdty5GX13ZRG2XiFxadAKJW",
    steroidsAnnual: "price_1QdtyHGX13ZRG2Xib8px0lu0"
  },
  production: {
    proMonthly: "price_1Qdt2dGX13ZRG2XiaKwG6VPu",
    proAnnual: "price_1Qdt3tGX13ZRG2XiesasShEJ",
    steroidsMonthly: "price_1Qdt4NGX13ZRG2XiMWXryAm9",
    steroidsAnnual: "price_1Qdt5HGX13ZRG2XiUW80k3Fk"
  }
};

export const SubscribeButton = ({ planId, planName, isPopular, isAnnual }: SubscribeButtonProps) => {
  const { toast } = useToast();
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus, error: subscriptionError } = useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) return null;
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Failed to check subscription:', error);
        toast({
          title: "Error",
          description: "Failed to verify subscription status. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!session?.access_token,
    retry: 1,
  });

  const { loading, handleSubscriptionAction } = useSubscriptionAction(session);

  // Map the planId to the correct environment-specific price ID
  const getEnvironmentPriceId = (planId: string) => {
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('lovable.app');
    const priceIds = isProduction ? PRICE_IDS.production : PRICE_IDS.development;

    switch(planId) {
      case PRICE_IDS.development.proMonthly:
        return isProduction ? PRICE_IDS.production.proMonthly : PRICE_IDS.development.proMonthly;
      case PRICE_IDS.development.proAnnual:
        return isProduction ? PRICE_IDS.production.proAnnual : PRICE_IDS.development.proAnnual;
      case PRICE_IDS.development.steroidsMonthly:
        return isProduction ? PRICE_IDS.production.steroidsMonthly : PRICE_IDS.development.steroidsMonthly;
      case PRICE_IDS.development.steroidsAnnual:
        return isProduction ? PRICE_IDS.production.steroidsAnnual : PRICE_IDS.development.steroidsAnnual;
      default:
        return planId;
    }
  };

  const getButtonText = () => {
    if (!subscriptionStatus?.subscribed) {
      if (isAnnual && planId === PRICE_IDS.development.proMonthly) {
        return "Save 20% with annual";
      }
      if (isAnnual && planId === PRICE_IDS.development.steroidsMonthly) {
        return "Save 20% with annual";
      }
      return `Upgrade to ${planName}`;
    }

    const isCurrentPlan = subscriptionStatus?.priceId === getEnvironmentPriceId(planId);
    if (isCurrentPlan) {
      return "Current Plan";
    }

    const isMonthlyToAnnualUpgrade = isAnnual && 
      ((subscriptionStatus?.priceId === PRICE_IDS.development.proMonthly && planId === PRICE_IDS.development.proAnnual) || 
       (subscriptionStatus?.priceId === PRICE_IDS.development.steroidsMonthly && planId === PRICE_IDS.development.steroidsAnnual));

    if (isMonthlyToAnnualUpgrade) {
      return "Save 20% with annual";
    }

    if (subscriptionStatus?.priceId === PRICE_IDS.development.steroidsMonthly && planId === PRICE_IDS.development.proMonthly) {
      return "Downgrade to Creator Pro";
    }

    return `Upgrade to ${planName}`;
  };

  const isCurrentPlan = subscriptionStatus?.subscribed && subscriptionStatus.priceId === getEnvironmentPriceId(planId);

  const isDowngrade = subscriptionStatus?.priceId === PRICE_IDS.development.steroidsMonthly && 
                     planId === PRICE_IDS.development.proMonthly;

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

  const handleClick = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }
    
    await handleSubscriptionAction(getEnvironmentPriceId(planId), planName, subscriptionStatus);
  };

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
        showThunderbolt={isAnnual && planId === PRICE_IDS.development.steroidsAnnual}
      />
    </Button>
  );
};