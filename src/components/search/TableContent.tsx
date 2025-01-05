import { Table, TableBody } from "@/components/ui/table";
import { PostTableHeader } from "./TableHeader";
import { PostTableRow } from "./TableRow";
import { MobilePostRow } from "./MobilePostRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface TableContentProps {
  currentPosts: any[];
  handleSort: (key: string) => void;
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export type SortDirection = "asc" | "desc";

export const TableContent = ({
  currentPosts,
  handleSort,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
}: TableContentProps) => {
  const isMobile = useIsMobile();
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSortClick = (key: string) => {
    // If clicking the same column, toggle direction
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as the sort key and default to ascending
      setSortKey(key);
      setSortDirection("asc");
    }
    handleSort(key);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {currentPosts.map((post, index) => (
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
            onSort={handleSortClick} 
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
          <TableBody>
            {currentPosts.map((post, index) => (
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