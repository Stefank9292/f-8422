import { Table, TableBody } from "@/components/ui/table";
import { PostTableHeader } from "../TableHeader";
import { PostTableRow } from "../TableRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SortDirection } from "../TableContent";

interface DesktopTableViewProps {
  posts: any[];
  handleSort: (key: string) => void;
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
  sortKey: string;
  sortDirection: SortDirection;
}

export const DesktopTableView = ({
  posts,
  handleSort,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
  sortKey,
  sortDirection,
}: DesktopTableViewProps) => {
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
            {posts.map((post, index) => (
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