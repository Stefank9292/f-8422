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

  const pricingPlans = [
    {
      name: "Creator Pro",
      description: "For Professional Creators",
      price: {
        monthly: "29",
        annual: { total: "276", perMonth: "23" }
      },
      features: [
        { included: true, text: "25 Total Searches per Month" },
        { included: true, text: "Maximum 25 Results per Username" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: false, text: "Search History" },
        { included: false, text: "Recent Searches" },
        { included: false, text: "Early Access to new Features" }
      ],
      priceId: isAnnual ? priceIds.premium.annual : priceIds.premium.monthly
    },
    {
      name: "Creator on Steroids",
      description: "For Viral Marketing Gods",
      price: {
        monthly: "49",
        annual: { total: "470", perMonth: "39.17" }
      },
      features: [
        { included: true, text: "Unlimited Searches" },
        { included: true, text: "Maximum 50 Results per Username" },
        { included: true, text: "Bulk Search" },
        { included: true, text: "Contact Support" },
        { included: true, text: "Search History" },
        { included: true, text: "Recent Searches" },
        { included: true, text: "Early Access to new Features" }
      ],
      isPopular: true,
      priceId: isAnnual ? priceIds.ultra.annual : priceIds.ultra.monthly
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
              <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
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