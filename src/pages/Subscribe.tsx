import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SubscribeButton } from "@/components/SubscribeButton";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PricingCard } from "@/components/pricing/PricingCard";

const SubscribePage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

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

  const getPlanBadgeText = () => {
    const planName = subscriptionStatus?.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3" ? "Ultra" : "Premium";
    return subscriptionStatus?.canceled 
      ? `${planName} (Cancels at end of period)` 
      : `${planName}`;
  };

  // Price IDs for different billing periods
  const priceIds = {
    premium: {
      monthly: "price_1QdBd2DoPDXfOSZFnG8aWuIq",
      annual: "price_1QdHTrDoPDXfOSZFhVlGuUAd"
    },
    ultra: {
      monthly: "price_1QdC54DoPDXfOSZFXHBO4yB3",
      annual: "price_1QdHUGDoPDXfOSZFGaGscfw5"
    }
  };

  const pricingPlans = [
    {
      name: "Free Plan",
      description: "Get started for free",
      price: {
        monthly: "0",
        annual: { total: "0", perMonth: "0" }
      },
      features: [
        { included: true, text: "3 Total Searches" },
        { included: true, text: "Maximum 5 Results per Search" },
        { included: false, text: "Bulk Search" },
        { included: false, text: "Contact Support" },
        { included: false, text: "Early Access to new Features" }
      ],
      priceId: "free"
    },
    {
      name: "Premium Plan",
      description: "Perfect for casual users",
      price: {
        monthly: "29.97",
        annual: { total: "287.64", perMonth: "23.97" }
      },
      features: [
        { included: true, text: "25 Total Searches" },
        { included: true, text: "Maximum 20 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: false, text: "Early Access to new Features" }
      ],
      priceId: isAnnual ? priceIds.premium.annual : priceIds.premium.monthly
    },
    {
      name: "Ultra Plan",
      description: "For power users",
      price: {
        monthly: "34.97",
        annual: { total: "335.64", perMonth: "27.97" }
      },
      features: [
        { included: true, text: "Unlimited Searches" },
        { included: true, text: "Maximum 50 Results per Search" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: true, text: "Early Access to new Features" }
      ],
      isPopular: true,
      priceId: isAnnual ? priceIds.ultra.annual : priceIds.ultra.monthly
    }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          {subscriptionStatus?.subscribed && (
            <div className="flex justify-center items-center gap-2">
              <span className="text-lg text-muted-foreground">Current Plan:</span>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {getPlanBadgeText()}
              </Badge>
            </div>
          )}
          <p className="text-xl text-muted-foreground">
            Select the plan that best fits your needs
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <div className="flex items-center gap-2">
              <span className={isAnnual ? "font-semibold" : "text-muted-foreground"}>Annual</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Save 20%</Badge>
            </div>
          </div>
        </div>

        {/* Subscription Management Card */}
        {subscriptionStatus?.subscribed && (
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Subscription Management</h2>
            <p className="text-muted-foreground">Manage your current subscription</p>
            <div className="flex gap-4">
              {subscriptionStatus.canceled ? (
                <ResumeSubscriptionButton className="w-full">
                  Resume Subscription
                </ResumeSubscriptionButton>
              ) : (
                <CancelSubscriptionButton 
                  isCanceled={subscriptionStatus?.canceled}
                  className="w-full"
                >
                  Cancel Subscription
                </CancelSubscriptionButton>
              )}
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              isAnnual={isAnnual}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;