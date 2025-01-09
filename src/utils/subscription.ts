import { PRICING_CONFIG } from "@/config/pricing";

export const getButtonText = (
  subscriptionStatus: any,
  planId: string,
  isAnnual: boolean,
  planName: string
) => {
  if (!subscriptionStatus?.subscribed) {
    if (isAnnual && planId === PRICING_CONFIG.premium.annual.priceId) {
      return "Save 20% with annual";
    }
    if (isAnnual && planId === PRICING_CONFIG.ultra.annual.priceId) {
      return "Save 20% with annual";
    }
    return `Upgrade to ${planName}`;
  }

  const isCurrentPlan = subscriptionStatus?.priceId === planId;
  if (isCurrentPlan) {
    return "Current Plan";
  }

  const isMonthlyToAnnualUpgrade = isAnnual && 
    ((subscriptionStatus?.priceId === PRICING_CONFIG.premium.monthly.priceId && planId === PRICING_CONFIG.premium.annual.priceId) || 
     (subscriptionStatus?.priceId === PRICING_CONFIG.ultra.monthly.priceId && planId === PRICING_CONFIG.ultra.annual.priceId));

  if (isMonthlyToAnnualUpgrade) {
    return "Save 20% with annual";
  }

  if (subscriptionStatus?.priceId === PRICING_CONFIG.ultra.monthly.priceId && planId === PRICING_CONFIG.premium.monthly.priceId) {
    return "Downgrade to Creator Pro";
  }

  return `Upgrade to ${planName}`;
};

export const getButtonStyle = (isPopular: boolean, isDowngrade: boolean) => {
  if (isPopular) {
    return "primary-gradient";
  }
  if (isDowngrade) {
    return "bg-gray-500 hover:bg-gray-600 text-white";
  }
  return "bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white";
};