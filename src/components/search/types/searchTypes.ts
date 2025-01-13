export type SearchType = 'instagram_search' | 'tiktok_search' | 'bulk_instagram_search' | 'bulk_tiktok_search';

export interface RecentSearchesProps {
  onSelect: (username: string) => void;
  onSearch: () => void;
}

export interface SearchBadgeProps {
  id: string;
  searchQuery: string;
  searchType: SearchType;
  bulkSearchUrls?: string[];
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
}

export interface BulkSearchHoverCardProps {
  urls: string[];
  onCopyUrls: (urls: string[]) => void;
}

export interface RecentSearchHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}