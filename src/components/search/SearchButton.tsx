import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchButtonContent } from "./SearchButtonContent";
import { usePlatformStore } from "@/store/platformStore";

interface SearchButtonProps {
  isLoading: boolean;
  isBulkSearching: boolean;
  hasReachedLimit: boolean;
  requestCount: number;
  maxRequests: number;
  currentUsername: string;
  onClick: () => void;
}

export const SearchButton = ({
  isLoading,
  isBulkSearching,
  hasReachedLimit,
  requestCount,
  maxRequests,
  currentUsername,
  onClick
}: SearchButtonProps) => {
  const { platform } = usePlatformStore();
  const hasNoSearchesLeft = requestCount >= maxRequests;
  const isButtonEnabled = currentUsername && !hasReachedLimit && !hasNoSearchesLeft && !isLoading && !isBulkSearching;
  const isSearchDisabled = isLoading || isBulkSearching || !currentUsername.trim() || hasReachedLimit || hasNoSearchesLeft;

  return (
    <Button 
      onClick={onClick}
      disabled={isSearchDisabled}
      className={cn(
        "w-full h-10 text-[11px] font-medium transition-all duration-300",
        {
          'instagram-gradient hover:opacity-90': isButtonEnabled && platform === 'instagram',
          '!bg-black hover:!bg-black/90': isButtonEnabled && platform === 'tiktok',
          'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800': !isButtonEnabled
        },
        "text-white dark:text-gray-100 shadow-sm hover:shadow-md",
        (hasReachedLimit || hasNoSearchesLeft) && "opacity-50 cursor-not-allowed"
      )}
    >
      <SearchButtonContent
        isLoading={isLoading}
        hasReachedLimit={hasReachedLimit}
        hasNoSearchesLeft={hasNoSearchesLeft}
        requestCount={requestCount}
        maxRequests={maxRequests}
      />
    </Button>
  );
};