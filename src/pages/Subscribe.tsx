import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscribeButton } from "@/components/SubscribeButton";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";

const SubscribePage = () => {
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

  const FeatureItem = ({ included, text }: { included: boolean; text: string }) => (
    <li className="flex items-center gap-2">
      {included ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <span className={!included ? "text-muted-foreground" : ""}>{text}</span>
    </li>
  );

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
        </div>

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
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Free Plan</h2>
              <p className="text-muted-foreground">Get started for free</p>
            </div>
            <ul className="space-y-2">
              <FeatureItem included={true} text="3 Total Searches" />
              <FeatureItem included={true} text="Maximum 5 Results per Search" />
              <FeatureItem included={false} text="Bulk Search" />
              <FeatureItem included={false} text="Contact Support" />
              <FeatureItem included={false} text="Early Access to new Features" />
            </ul>
            <div className="pt-4">
              <SubscribeButton planId="free" planName="Free" />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Premium Plan</h2>
              <p className="text-muted-foreground">Perfect for casual users</p>
            </div>
            <ul className="space-y-2">
              <FeatureItem included={true} text="25 Total Searches" />
              <FeatureItem included={true} text="Maximum 20 Results per Search" />
              <FeatureItem included={true} text="Bulk Search" />
              <FeatureItem included={true} text="Contact Support" />
              <FeatureItem included={false} text="Early Access to new Features" />
            </ul>
            <div className="pt-4">
              <SubscribeButton planId="price_1QdBd2DoPDXfOSZFnG8aWuIq" planName="Premium" />
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-2 border-primary">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Ultra Plan</h2>
                <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded">Best Value</span>
              </div>
              <p className="text-muted-foreground">For power users</p>
            </div>
            <ul className="space-y-2">
              <FeatureItem included={true} text="Unlimited Searches" />
              <FeatureItem included={true} text="Maximum 50 Results per Search" />
              <FeatureItem included={true} text="Bulk Search" />
              <FeatureItem included={true} text="Contact Support" />
              <FeatureItem included={true} text="Early Access to new Features" />
            </ul>
            <div className="pt-4">
              <SubscribeButton planId="price_1QdC54DoPDXfOSZFXHBO4yB3" planName="Ultra" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;