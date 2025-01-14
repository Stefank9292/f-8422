import { useState, useCallback } from 'react';
import { SortDirection, SortState } from '@/types/search';

export const useSort = (defaultKey: string = '', defaultDirection: SortDirection = 'desc') => {
  const [sortState, setSortState] = useState<SortState>({
    key: defaultKey,
    direction: defaultDirection,
  });

  const handleSort = useCallback((key: string) => {
    setSortState(prev => ({
      key,
      direction: prev.key === key 
        ? prev.direction === 'asc' ? 'desc' : 'asc'
        : 'desc'
    }));
  }, []);

  const sortData = useCallback(<T extends Record<string, any>>(data: T[]): T[] => {
    if (!sortState.key) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortState.key];
      const valueB = b[sortState.key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortState.direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }, [sortState]);

  return {
    sortState,
    handleSort,
    sortData,
  };
};