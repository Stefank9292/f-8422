import { useToast } from "@/hooks/use-toast";

interface ValidationProps {
  currentUsername: string;
  requestCount: number;
  maxRequests: number;
  subscriptionStatus: any;
  isLoading: boolean;
  isBulkSearching: boolean;
}

export const useSearchValidation = ({
  currentUsername,
  requestCount,
  maxRequests,
  subscriptionStatus,
  isLoading,
  isBulkSearching
}: ValidationProps) => {
  const { toast } = useToast();

  const validateSearch = () => {
    if (!currentUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
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

    if (isLoading || isBulkSearching) {
      return false;
    }

    return true;
  };

  return { validateSearch };
};