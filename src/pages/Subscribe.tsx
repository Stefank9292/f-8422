import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubscribeButton } from "@/components/SubscribeButton";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
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
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Click crown up to 3 times</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Basic features included</span>
              </li>
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
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Click crown up to 10 times</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Basic features included</span>
              </li>
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
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Click crown up to 20 times</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>All Premium features included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </li>
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

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default SubscribePage;