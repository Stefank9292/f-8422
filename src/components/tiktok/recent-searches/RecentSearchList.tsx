import { RecentSearchItem } from "./RecentSearchItem";

interface RecentSearchListProps {
  searches: Array<{ id: string; search_query: string }>;
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
}

export const RecentSearchList = ({ 
  searches, 
  onSelect, 
  onRemove 
}: RecentSearchListProps) => {
  return (
    <div className="w-full flex flex-wrap justify-center gap-2.5">
      {searches.map((search) => (
        <RecentSearchItem
          key={search.id}
          id={search.id}
          searchQuery={search.search_query}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};