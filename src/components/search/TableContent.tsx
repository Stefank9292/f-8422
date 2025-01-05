import { Table, TableBody } from "@/components/ui/table";
import { PostTableHeader } from "./TableHeader";
import { PostTableRow } from "./TableRow";
import { MobilePostRow } from "./MobilePostRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-mobile";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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