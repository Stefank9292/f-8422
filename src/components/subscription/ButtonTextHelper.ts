import { SubscriptionStatus } from "@/types/subscription";

export const getButtonText = (
  planId: string,
  subscriptionStatus: SubscriptionStatus | null,
  isLoading: boolean
): string => {
  const isMonthlyToAnnualUpgrade = 
    (subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" && planId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") ||
    (subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtyHGX13ZRG2Xib8px0lu0");

  if (isMonthlyToAnnualUpgrade) {
    return "Save 20% with annual";
  }

  if (subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtwnGX13ZRG2XihcM36r3W") {
    return "Downgrade to Creator";
  }

  if (subscriptionStatus?.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" && planId === "price_1Qdty5GX13ZRG2XiFxadAKJW") {
    return "Upgrade to Creator on Steroids";
  }

  if (isLoading) {
    return "Loading...";
  }

  return "Choose Plan";
};

export const getButtonVariant = (
  planId: string,
  subscriptionStatus: SubscriptionStatus | null
): "default" | "secondary" | "destructive" => {
  if (subscriptionStatus?.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" && planId === "price_1QdtwnGX13ZRG2XihcM36r3W") {
    return "destructive";
  }
  return "default";
};