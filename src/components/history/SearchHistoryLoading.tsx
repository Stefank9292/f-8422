import { Loader2 } from "lucide-react";

export const SearchHistoryLoading = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};