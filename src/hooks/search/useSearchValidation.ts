import { useToast } from "@/hooks/use-toast";

export const useSearchValidation = (
  requestCount: number,
  maxRequests: number,
  subscriptionStatus: any
) => {
  const { toast } = useToast();

  const validateSearch = (username: string) => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return false;
    }

    if (requestCount >= maxRequests) {
      const planName = subscriptionStatus?.priceId ? 'Pro' : 'Free';
      toast({
        title: "Monthly Limit Reached",
        description: `You've reached your monthly limit of ${maxRequests} searches on the ${planName} plan. Please upgrade for more searches.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateSearch };
};