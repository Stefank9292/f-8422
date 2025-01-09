import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkSearchButtonProps {
  isEnabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const BulkSearchButton = ({ isEnabled, isLoading, onClick }: BulkSearchButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="absolute right-2 top-1/2 transform -translate-y-1/2 
                flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80
                dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/80
                h-7 px-3 rounded-lg"
      onClick={onClick}
      disabled={isLoading}
    >
      <List className="w-3.5 h-3.5" />
      <span className="hidden md:inline text-[11px] font-medium">Bulk Search</span>
    </Button>
  );
};