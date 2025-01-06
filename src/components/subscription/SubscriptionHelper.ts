import { SubscriptionStatus } from "@/types/subscription";

export const isCurrentPlan = (planId: string, subscriptionStatus: SubscriptionStatus | null): boolean => {
  return subscriptionStatus?.priceId === planId;
};

export const isSubscriptionCanceled = (subscriptionStatus: SubscriptionStatus | null): boolean => {
  return subscriptionStatus?.cancel_at_period_end || false;
};

export const canUpgradeOrDowngrade = (planId: string, subscriptionStatus: SubscriptionStatus | null): boolean => {
  if (!subscriptionStatus?.subscribed) return true;
  
  const isMonthlyToAnnualUpgrade = 
    (subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" && planId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") ||
    (subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtyHGX13ZRG2Xib8px0lu0");

  if (isMonthlyToAnnualUpgrade) return true;

  const isDowngrade = subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && 
                     planId === "price_1QdtwnGX13ZRG2XihcM36r3W";
  
  const isUpgrade = subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" && 
                    planId === "price_1Qdty5GX13ZRG2XiFxadAKJW";

  return isDowngrade || isUpgrade;
};