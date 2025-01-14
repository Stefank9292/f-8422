import { Table, TableBody } from "@/components/ui/table";
import { TikTokTableHeader } from "./TikTokTableHeader";
import { TikTokTableRow } from "./TikTokTableRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export type SortDirection = "asc" | "desc";

interface TikTokTableContentProps {
  currentPosts: any[];
  handleCopyCaption: (caption: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const TikTokTableContent = ({
  currentPosts,
  handleCopyCaption,
  formatNumber,
  truncateCaption,
}: TikTokTableContentProps) => {
  const isMobile = useIsMobile();
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedPosts = [...currentPosts].sort((a, b) => {
    if (!sortKey) return 0;

    let valueA = a[sortKey];
    let valueB = b[sortKey];

    if (sortKey === 'uploadedAtFormatted') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      // No conversion needed for numbers
    } else {
      valueA = String(valueA);
      valueB = String(valueB);
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    }
    return valueA < valueB ? 1 : -1;
  });

  if (isMobile) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Mobile view coming soon
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-xl overflow-hidden border border-gray-200/80 dark:border-gray-700/80 
                    bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
        <Table>
          <TikTokTableHeader 
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
          <TableBody>
            {sortedPosts.map((post, index) => (
              <TikTokTableRow
                key={index}
                post={post}
                onCopyCaption={handleCopyCaption}
                formatNumber={formatNumber}
                truncateCaption={truncateCaption}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};