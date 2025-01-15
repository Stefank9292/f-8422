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
      monthly: "price_1QfKMGGX13ZRG2XiFyskXyJo", // Creator Pro Monthly
      annual: "price_1QfKMYGX13ZRG2XioPYKCe7h"   // Creator Pro Annual
    },
    ultra: {
      monthly: "price_1Qdt4NGX13ZRG2XiMWXryAm9", // Creator on Steroids Monthly
      annual: "price_1Qdt5HGX13ZRG2XiUW80k3Fk"   // Creator on Steroids Annual
    }
  };

  const pricingPlans = [
    {
      name: "Creator Pro",
      description: "For Professional Creators",
      price: {
        monthly: "49",
        annual: { total: "470", perMonth: "39.17" }
      },
      priceId: isAnnual ? priceIds.premium.annual : priceIds.premium.monthly
    },
    {
      name: "Creator on Steroids",
      description: "For Viral Marketing Gods",
      price: {
        monthly: "69",
        annual: { total: "663", perMonth: "55.25" }
      },
      isPopular: true,
      priceId: isAnnual ? priceIds.ultra.annual : priceIds.ultra.monthly
    }
  ];

  const { title, subtitle } = getPageTitle();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-6 md:pb-8">
      <div className="container max-w-7xl mx-auto px-4 space-y-8 md:space-y-12">
        <div className="space-y-2 text-center">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight dark:text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="scale-90"
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Annual
              </span>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Save 20%
              </Badge>
            </div>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
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