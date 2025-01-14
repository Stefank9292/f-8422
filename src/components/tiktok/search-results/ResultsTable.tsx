import { TableContainer } from "@/components/common/table/TableContainer";
import { TablePagination } from "@/components/search/TablePagination";
import { TikTokTableContent } from "../TikTokTableContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsTableProps {
  filteredResults: any[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  onCopyCaption: (caption: string) => void;
}

export const ResultsTable = ({
  filteredResults,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onCopyCaption,
}: ResultsTableProps) => {
  const isMobile = useIsMobile();
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredResults.slice(startIndex, endIndex);

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
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-xl overflow-hidden">
        <TableContainer>
          <TikTokTableContent 
            currentPosts={currentPosts}
            handleCopyCaption={onCopyCaption}
            formatNumber={(num) => num.toLocaleString('de-DE').replace(/,/g, '.')}
            truncateCaption={(caption) => caption}
          />
        </TableContainer>
      </div>
      <div className="border-t border-border/50 pt-8 bg-transparent">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          totalResults={filteredResults.length}
        />
      </div>
    </div>
  );
};