import { Loader2, Search, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface SearchButtonContentProps {
  isLoading: boolean;
  hasReachedLimit: boolean;
  hasNoSearchesLeft: boolean;
  requestCount: number;
  maxRequests: number;
}

export const SearchButtonContent = ({
  isLoading,
  hasReachedLimit,
  hasNoSearchesLeft,
  requestCount,
  maxRequests,
}: SearchButtonContentProps) => {
  if (isLoading) {
    return (
      <>
        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        <span>This can take up to a minute...</span>
      </>
    );
  }

  if (hasReachedLimit || hasNoSearchesLeft) {
    return (
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5" />
        <span>Monthly Limit Reached ({requestCount}/{maxRequests})</span>
        <Link 
          to="/subscribe" 
          className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded hover:bg-white/30 transition-colors"
        >
          Upgrade
        </Link>
      </div>
    );
  }

  return (
    <>
      <Search className="mr-2 h-3.5 w-3.5" />
      Search Viral Videos
    </>
  );
};