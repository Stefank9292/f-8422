import { InstagramPost } from "@/types/instagram";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Table, TableBody } from "@/components/ui/table";
import { PostTableHeader } from "../search/TableHeader";
import { PostTableRow } from "../search/TableRow";
import { MobilePostRow } from "../search/MobilePostRow";
import { useIsMobile } from "@/hooks/use-mobile";
import { SortDirection } from "@/hooks/useSortResults";

interface ResultsTableSectionProps {
  currentPosts: InstagramPost[];
  handleSort: (key: string) => void;
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
  sortKey: string;
  sortDirection: SortDirection;
}

export function ResultsTableSection({
  currentPosts,
  handleSort,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
  sortKey,
  sortDirection,
}: ResultsTableSectionProps) {
  const isMobile = useIsMobile();

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
            onSort={handleSort}
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
}