import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingCard } from "@/components/pricing/PricingCard";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Subscribe() {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session, isLoading: isLoading, error: sessionError } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: subscriptionStatus, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      if (!session) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
  });

  const title = "Level up your content game";
  const description = "Choose the plan that best fits your needs. All plans include access to our core features.";

  const proMonthlyPrice = "9.99";
  const proAnnualPrice = "99.99";
  const steroidsMonthlyPrice = "19.99";
  const steroidsAnnualPrice = "199.99";

  const proFeatures = [
    "25 Total Searches per Month",
    "Maximum 25 Results per Username",
    "Export to CSV",
    "Advanced Filters",
    "Bulk Search (Up to 5 Usernames)",
    "7 Days Search History",
    "Priority Support"
  ];

  const steroidsFeatures = [
    "50 Total Searches per Month",
    "Maximum 50 Results per Username",
    "Export to CSV",
    "Advanced Filters",
    "Bulk Search (Up to 10 Usernames)",
    "30 Days Search History",
    "Priority Support",
    "Early Access to New Features"
  ];

  const handleCreateCheckoutSession = async (priceId: string) => {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      },
      body: { priceId }
    });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session.",
        variant: "destructive",
      });
      return;
    }
    window.location.href = data.url;
  };

  if (isLoading || isSubscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen p-4 bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12 pt-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-center text-foreground dark:text-white">
            {title}
          </h1>
          <p className="text-[13px] text-muted-foreground dark:text-gray-400 text-center">
            {description}
          </p>
        </div>

        <div className="space-y-12">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-[11px] ${!isAnnual ? "text-foreground dark:text-white" : "text-muted-foreground dark:text-gray-400"}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-[11px] ${isAnnual ? "text-foreground dark:text-white" : "text-muted-foreground dark:text-gray-400"}`}>
              Annual (Save 17%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PricingCard
              title="Creator Pro"
              description="Perfect for creators who want to level up their content game"
              price={isAnnual ? proAnnualPrice : proMonthlyPrice}
              interval={isAnnual ? "year" : "month"}
              features={proFeatures}
              onSubscribe={() => handleCreateCheckoutSession(
                isAnnual ? "price_1Qdtx2GX13ZRG2XieXrqPxAV" : "price_1QdtwnGX13ZRG2XihcM36r3W"
              )}
              isCurrentPlan={subscriptionStatus?.priceId === (
                isAnnual ? "price_1Qdtx2GX13ZRG2XieXrqPxAV" : "price_1QdtwnGX13ZRG2XihcM36r3W"
              )}
              className="bg-white dark:bg-gray-800 border-border dark:border-gray-700"
            />
            <PricingCard
              title="Creator on Steroids"
              description="For power users who need more searches and results"
              price={isAnnual ? steroidsAnnualPrice : steroidsMonthlyPrice}
              interval={isAnnual ? "year" : "month"}
              features={steroidsFeatures}
              onSubscribe={() => handleCreateCheckoutSession(
                isAnnual ? "price_1QdtyHGX13ZRG2Xib8px0lu0" : "price_1Qdty5GX13ZRG2XiFxadAKJW"
              )}
              isCurrentPlan={subscriptionStatus?.priceId === (
                isAnnual ? "price_1QdtyHGX13ZRG2Xib8px0lu0" : "price_1Qdty5GX13ZRG2XiFxadAKJW"
              )}
              className="bg-white dark:bg-gray-800 border-border dark:border-gray-700"
              featured
            />
          </div>
        </div>
      </div>
    </div>
  );
}
