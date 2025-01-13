import { Table, TableBody } from "@/components/ui/table";
import { TikTokTableHeader } from "./TikTokTableHeader";
import { TikTokTableRow } from "./TikTokTableRow";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { TikTokMobilePostRow } from "./TikTokMobilePostRow";

interface TikTokTableContentProps {
  currentPosts: any[];
  handleSort: (key: string) => void;
  formatNumber: (num: number) => string;
  sortKey: string;
  sortDirection: "asc" | "desc";
}

export const TikTokTableContent = ({
  currentPosts,
  handleSort,
  formatNumber,
  sortKey,
  sortDirection,
}: TikTokTableContentProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {currentPosts.map((post, index) => (
          <TikTokMobilePostRow
            key={index}
            post={post}
            formatNumber={formatNumber}
          />
        ))}
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
            {currentPosts.map((post, index) => (
              <TikTokTableRow
                key={index}
                post={post}
                formatNumber={formatNumber}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};