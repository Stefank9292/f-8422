import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { ResumeSubscriptionButton } from "@/components/ResumeSubscriptionButton";

interface SubscriptionManagementProps {
  isCanceled?: boolean;
}

export const SubscriptionManagement = ({ isCanceled }: SubscriptionManagementProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Subscription Management</h2>
      </div>
      <p className="text-muted-foreground">
        Manage your current subscription settings and billing preferences
      </p>
      <div className="flex gap-4 pt-2">
        {isCanceled ? (
          <ResumeSubscriptionButton className="w-full">
            Resume Subscription
          </ResumeSubscriptionButton>
        ) : (
          <CancelSubscriptionButton 
            isCanceled={isCanceled}
            className="w-full"
          >
            Cancel Subscription
          </CancelSubscriptionButton>
        )}
      </div>
    </Card>
  );
};