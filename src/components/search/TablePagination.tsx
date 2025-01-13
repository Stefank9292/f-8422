import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  totalResults: number;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalResults,
}: TablePaginationProps) => {
  if (totalResults <= 25) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 
                  bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200/80 dark:border-gray-700/80 
                  backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Show</span>
        <Select
          value={pageSize.toString()}
          onValueChange={onPageSizeChange}
        >
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue placeholder="25" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25" className="text-xs">25 rows</SelectItem>
            <SelectItem value="50" className="text-xs">50 rows</SelectItem>
            <SelectItem value="100" className="text-xs">100 rows</SelectItem>
          </SelectContent>
        </Select>
        <span>of {totalResults} results</span>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={cn(
                "h-8 min-w-8 px-2 text-xs transition-colors hover:bg-accent",
                "border border-gray-200/80 dark:border-gray-700/80",
                currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              )}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={cn(
                  "h-8 min-w-8 px-3 text-xs transition-colors border border-gray-200/80 dark:border-gray-700/80",
                  currentPage === page 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-accent"
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className={cn(
                "h-8 min-w-8 px-2 text-xs transition-colors hover:bg-accent",
                "border border-gray-200/80 dark:border-gray-700/80",
                currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};