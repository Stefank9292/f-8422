import { Table, TableBody } from "@/components/ui/table";
import { PostTableHeader } from "./TableHeader";
import { PostTableRow } from "./TableRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TableContentProps {
  currentPosts: any[];
  handleSort: (key: string) => void;
  handleCopyCaption: (caption: string) => void;
  handleDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const TableContent = ({
  currentPosts,
  handleSort,
  handleCopyCaption,
  handleDownload,
  formatNumber,
  truncateCaption,
}: TableContentProps) => {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <div className={cn(
        "rounded-xl overflow-hidden border border-border",
        isMobile && "bg-card shadow-sm"
      )}>
        <Table>
          <PostTableHeader onSort={handleSort} />
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