import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

  const getPageTitle = () => {
    if (!subscriptionStatus?.subscribed) {
      return {
        title: "Choose Your Plan",
        subtitle: "Select the plan that best fits your needs and manage your subscription"
      };
    }
    return {
      title: "Manage Subscription",
      subtitle: "View your current plan details and manage your subscription settings"
    };
  };

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
      name: "Creator Pro",
      description: "For Professional Creators",
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
      name: "Creator on Steroids",
      description: "For Viral Marketing Gods",
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

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-12 pt-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Pricing Plans Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-4">
            <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <div className="flex items-center gap-2">
              <span className={isAnnual ? "font-semibold" : "text-muted-foreground"}>
                Annual
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </div>
          </div>

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
    </div>
  );
};

export default SubscribePage;