import { TablePagination } from "../TablePagination";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  totalResults: number;
}

export const SearchPagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalResults,
}: SearchPaginationProps) => {
  return (
    <div className="border-t border-border/50 pt-8 bg-transparent">
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        totalResults={totalResults}
      />
    </div>
  );
};