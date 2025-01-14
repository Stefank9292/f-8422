import { useState, useMemo } from 'react';
import { PaginationState } from '@/types/search';

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = ({
  totalItems,
  initialPage = 1,
  initialPageSize = 25
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationState: PaginationState = useMemo(() => ({
    currentPage,
    pageSize,
    totalResults: totalItems
  }), [currentPage, pageSize, totalItems]);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginateData = <T>(data: T[]): T[] => {
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    paginationState,
    totalPages,
    paginateData,
    handlePageChange,
    handlePageSizeChange,
  };
};