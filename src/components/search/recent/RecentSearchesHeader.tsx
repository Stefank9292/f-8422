import { History, ChevronDown, ChevronUp } from "lucide-react";

interface RecentSearchesHeaderProps {
  isCollapsed: boolean;
  onClick: () => void;
}

export const RecentSearchesHeader = ({ isCollapsed, onClick }: RecentSearchesHeaderProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
    >
      <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      <span className="font-medium">Recent Searches</span>
      {isCollapsed ? (
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      ) : (
        <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      )}
    </button>
  );
};