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

  const calculateEngagement = (post: any) => {
    return (post.likes / post.views) * 100;
  };

  const sortedPosts = [...currentPosts].sort((a, b) => {
    if (!sortKey) return 0;

    let valueA, valueB;

    if (sortKey === 'engagement') {
      valueA = calculateEngagement(a);
      valueB = calculateEngagement(b);
    } else if (sortKey === 'uploadedAtFormatted') {
      valueA = new Date(a[sortKey]).getTime();
      valueB = new Date(b[sortKey]).getTime();
    } else {
      valueA = a[sortKey];
      valueB = b[sortKey];
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    // Handle string comparisons
    valueA = String(valueA).toLowerCase();
    valueB = String(valueB).toLowerCase();
    
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
      <div className="rounded-xl overflow-hidden border border-border/50 bg-white/90 dark:bg-gray-800/90 
                    backdrop-blur-sm shadow-lg transition-all duration-300">
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