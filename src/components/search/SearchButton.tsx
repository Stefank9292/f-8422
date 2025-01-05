import { cn } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";

interface SearchButtonProps {
  isLoading: boolean;
  isBulkSearching: boolean;
  username: string;
  hasReachedLimit: boolean;
  requestCount: number;
  maxRequests: number;
  onClick: () => void;
}

export const SearchButton = ({
  isLoading,
  isBulkSearching,
  username,
  hasReachedLimit,
  requestCount,
  maxRequests,
  onClick
}: SearchButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isBulkSearching || !username || hasReachedLimit}
      className={cn(
        "w-full h-10 text-[11px] font-medium transition-all duration-300",
        username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
        "text-white dark:text-gray-100 shadow-sm hover:shadow-md",
        hasReachedLimit && "opacity-50 cursor-not-allowed"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          <span>This can take up to a minute...</span>
        </>
      ) : hasReachedLimit ? (
        <>
          <Search className="mr-2 h-3.5 w-3.5" />
          Daily Limit Reached ({requestCount}/{maxRequests})
        </>
      ) : (
        <>
          <Search className="mr-2 h-3.5 w-3.5" />
          Search Viral Videos
        </>
      )}
    </button>
  );
};