import { Table, TableBody } from "@/components/ui/table";
import { PostTableHeader } from "./TableHeader";
import { PostTableRow } from "./TableRow";
import { MobilePostRow } from "./MobilePostRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export type SortDirection = "asc" | "desc";

interface TableContentProps {
  currentPosts: any[];
  handleSort?: (key: string) => void;
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
  sortKey?: string;
  sortDirection?: SortDirection;
}

export const TableContent = ({
  currentPosts,
  handleSort: externalHandleSort,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
  sortKey: externalSortKey,
  sortDirection: externalSortDirection,
}: TableContentProps) => {
  const isMobile = useIsMobile();
  const [internalSortKey, setInternalSortKey] = useState<string>("");
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>("desc");

  // Use external sort state if provided, otherwise use internal state
  const sortKey = externalSortKey !== undefined ? externalSortKey : internalSortKey;
  const sortDirection = externalSortDirection !== undefined ? externalSortDirection : internalSortDirection;

  const handleSortInternal = (key: string) => {
    if (externalHandleSort) {
      externalHandleSort(key);
      return;
    }

    // If clicking the same column, toggle direction
    if (internalSortKey === key) {
      setInternalSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as the sort key and default to descending
      setInternalSortKey(key);
      setInternalSortDirection("desc");
    }
  };

  // Apply sorting to the posts if no external sort is provided
  const sortedPosts = externalHandleSort ? currentPosts : [...currentPosts].sort((a: any, b: any) => {
    if (!sortKey) return 0;

    if (sortKey === 'date') {
      const dateA = new Date(a[sortKey]).getTime();
      const dateB = new Date(b[sortKey]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortKey === 'engagement') {
      // Convert engagement percentage strings to numbers for comparison
      const engagementA = parseFloat(a[sortKey].replace('%', ''));
      const engagementB = parseFloat(b[sortKey].replace('%', ''));
      return sortDirection === 'asc' ? engagementA - engagementB : engagementB - engagementA;
    }
    
    const valueA = a[sortKey];
    const valueB = b[sortKey];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    return 0;
  });

  if (isMobile) {
    return (
      <div className="space-y-4">
        {sortedPosts.map((post, index) => (
          <MobilePostRow
            key={index}
            post={post}
            onCopyCaption={handleCopyCaption}
            onDownload={handleDownload}
            formatNumber={formatNumber}
            truncateCaption={truncateCaption}
          />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-xl overflow-hidden border border-border">
        <Table>
          <PostTableHeader 
            onSort={handleSortInternal}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
          <TableBody>
            {sortedPosts.map((post, index) => (
              <PostTableRow
                key={index}
                post={post}
                onCopyCaption={handleCopyCaption}
                onDownload={handleDownload}
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