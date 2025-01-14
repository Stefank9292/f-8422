import { useState, useCallback } from 'react';
import { FilterState } from '@/types/search';

const initialFilterState: FilterState = {
  postsNewerThan: '',
  minViews: '',
  minPlays: '',
  minLikes: '',
  minComments: '',
  minEngagement: '',
};

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const applyFilters = useCallback(<T extends Record<string, any>>(data: T[]): T[] => {
    return data.filter(item => {
      if (filters.postsNewerThan && new Date(item.date) < new Date(filters.postsNewerThan)) {
        return false;
      }
      if (filters.minViews && item.viewsCount < parseInt(filters.minViews)) {
        return false;
      }
      if (filters.minPlays && item.playsCount < parseInt(filters.minPlays)) {
        return false;
      }
      if (filters.minLikes && item.likesCount < parseInt(filters.minLikes)) {
        return false;
      }
      if (filters.minComments && item.commentsCount < parseInt(filters.minComments)) {
        return false;
      }
      if (filters.minEngagement) {
        const engagementValue = parseFloat(item.engagement.replace('%', ''));
        if (engagementValue < parseFloat(filters.minEngagement)) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  return {
    filters,
    handleFilterChange,
    resetFilters,
    applyFilters,
  };
};