import { useState, useCallback } from 'react';
import { FilterState } from '@/utils/filterResults';

export const useFilterState = () => {
  const [filters, setFilters] = useState<FilterState>({
    minViews: '',
    minPlays: '',
    minLikes: '',
    minComments: '',
    minEngagement: '',
    postsNewerThan: '',
    minShares: '',
  });

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      minViews: '',
      minPlays: '',
      minLikes: '',
      minComments: '',
      minEngagement: '',
      postsNewerThan: '',
      minShares: '',
    });
  }, []);

  return {
    filters,
    handleFilterChange,
    resetFilters,
  };
};