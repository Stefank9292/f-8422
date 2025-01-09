import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { PRICING_CONFIG } from "@/config/pricing";

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

  const pricingPlans = [
    {
      ...PRICING_CONFIG.premium,
      price: {
        monthly: PRICING_CONFIG.premium.monthly.price,
        annual: {
          total: PRICING_CONFIG.premium.annual.total,
          perMonth: PRICING_CONFIG.premium.annual.perMonth
        }
      },
      priceId: isAnnual ? PRICING_CONFIG.premium.annual.priceId : PRICING_CONFIG.premium.monthly.priceId
    },
    {
      ...PRICING_CONFIG.ultra,
      price: {
        monthly: PRICING_CONFIG.ultra.monthly.price,
        annual: {
          total: PRICING_CONFIG.ultra.annual.total,
          perMonth: PRICING_CONFIG.ultra.annual.perMonth
        }
      },
      isPopular: true,
      priceId: isAnnual ? PRICING_CONFIG.ultra.annual.priceId : PRICING_CONFIG.ultra.monthly.priceId
    }
  ];

  const { title, subtitle } = getPageTitle();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-12 pt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-center dark:text-foreground">{title}</h1>
          <p className="text-[13px] text-muted-foreground text-center">
            {subtitle}
          </p>
        </div>

        <div className="space-y-12">
          <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

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