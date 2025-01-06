import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  username: string;
  isLoading: boolean;
  isBulkSearching: boolean;
  hasReachedLimit: boolean;
  requestCount: number;
  maxRequests: number;
  isProUser: boolean;
  isSteroidsUser: boolean;
  subscriptionStatus: any;
  onClick: () => void;
}

export const SearchButton = ({
  username,
  isLoading,
  isBulkSearching,
  hasReachedLimit,
  requestCount,
  maxRequests,
  isProUser,
  isSteroidsUser,
  subscriptionStatus,
  onClick
}: SearchButtonProps) => {
  const isDisabled = isLoading || 
                    isBulkSearching || 
                    !username.trim() || 
                    hasReachedLimit || 
                    (!subscriptionStatus?.subscribed && requestCount === 0) ||
                    (isProUser && requestCount >= maxRequests);

  const getButtonText = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          <span>This can take up to a minute...</span>
        </>
      );
    }

    if (hasReachedLimit) {
      return (
        <>
          <Search className="mr-2 h-3.5 w-3.5" />
          Monthly Limit Reached ({requestCount}/{maxRequests})
        </>
      );
    }

    if (!subscriptionStatus?.subscribed) {
      if (requestCount === 0) {
        return (
          <>
            <Search className="mr-2 h-3.5 w-3.5" />
            No Searches Left (Resets in 30 days)
          </>
        );
      }
      return (
        <>
          <Search className="mr-2 h-3.5 w-3.5" />
          Search Viral Videos ({maxRequests - requestCount} free searches left)
        </>
      );
    }

    if (isProUser && requestCount >= maxRequests) {
      return (
        <>
          <Search className="mr-2 h-3.5 w-3.5" />
          Pro Plan Limit Reached (Upgrade for Unlimited)
        </>
      );
    }

    if (isSteroidsUser) {
      return (
        <>
          <Search className="mr-2 h-3.5 w-3.5" />
          Search Viral Videos
        </>
      );
    }

    return (
      <>
        <Search className="mr-2 h-3.5 w-3.5" />
        Search Viral Videos ({maxRequests - requestCount} searches left)
      </>
    );
  };

  return (
    <Button 
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full h-10 text-[11px] font-medium transition-all duration-300",
        username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
        "text-white dark:text-gray-100 shadow-sm hover:shadow-md",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {getButtonText()}
    </Button>
  );
};