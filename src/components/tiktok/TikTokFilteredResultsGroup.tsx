import { TikTokFilteredResultsSection } from "./TikTokFilteredResultsSection";

export const TikTokFilteredResultsGroup = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TikTokFilteredResultsSection
        results={[]}
        filters={{
          postsNewerThan: "",
          minViews: "",
          minLikes: "",
          minComments: "",
          minShares: "",
        }}
        onFilterChange={() => {}}
        onResetFilters={() => {}}
      />
    </div>
  );
};