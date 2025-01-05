import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingCard } from "@/components/pricing/PricingCard";
import { useNavigate } from "react-router-dom";

const SubscribePage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      monthly: "price_1QdtwnGX13ZRG2XihcM36r3W",
      annual: "price_1Qdtx2GX13ZRG2XieXrqPxAV"
    },
    ultra: {
      monthly: "price_1Qdty5GX13ZRG2XiFxadAKJW",
      annual: "price_1QdtyHGX13ZRG2Xib8px0lu0"
    }
  };

  const handleSubscribe = async (priceId: string) => {
    // Implement subscription logic here
  };

  const pricingPlans = [
    {
      title: "Free Plan",
      description: "Get started for free",
      price: "$0",
      buttonText: "Get Started",
      features: [
        { name: "3 Total Searches", included: true },
        { name: "Maximum 5 Results per Search", included: true },
        { name: "Bulk Search", included: false },
        { name: "Contact Support", included: false },
        { name: "Early Access to new Features", included: false }
      ],
      priceId: "free",
      onClick: () => handleSubscribe("free")
    },
    {
      title: "Creator Pro",
      description: "For Professional Creators",
      price: isAnnual ? "$23/month" : "$29/month",
      buttonText: "Subscribe",
      features: [
        { name: "25 Total Searches", included: true },
        { name: "Maximum 20 Results per Search", included: true },
        { name: "Bulk Search", included: true },
        { name: "Contact Support", included: true },
        { name: "Early Access to new Features", included: false }
      ],
      priceId: isAnnual ? priceIds.premium.annual : priceIds.premium.monthly,
      onClick: () => handleSubscribe(isAnnual ? priceIds.premium.annual : priceIds.premium.monthly)
    },
    {
      title: "Creator on Steroids",
      description: "For Viral Marketing Gods",
      price: isAnnual ? "$39.17/month" : "$49/month",
      buttonText: "Subscribe",
      features: [
        { name: "Unlimited Searches", included: true },
        { name: "Maximum 50 Results per Search", included: true },
        { name: "Bulk Search", included: true },
        { name: "Contact Support", included: true },
        { name: "Early Access to new Features", included: true }
      ],
      popular: true,
      priceId: isAnnual ? priceIds.ultra.annual : priceIds.ultra.monthly,
      onClick: () => handleSubscribe(isAnnual ? priceIds.ultra.annual : priceIds.ultra.monthly)
    }
  ];

  const { title, subtitle } = getPageTitle();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-8 pt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-center">{title}</h1>
          <p className="text-[13px] text-muted-foreground text-center">
            {subtitle}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-[11px] ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="scale-90"
            />
            <div className="flex items-center gap-2">
              <span className={`text-[11px] ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Annual
              </span>
              <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </div>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
