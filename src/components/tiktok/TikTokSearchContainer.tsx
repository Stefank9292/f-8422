import { TikTokSearchGroup } from "./TikTokSearchGroup";
import { TikTokFilteredResultsGroup } from "./TikTokFilteredResultsGroup";

export const TikTokSearchContainer = () => {
  return (
    <div className="space-y-8">
      <TikTokSearchGroup />
      <TikTokFilteredResultsGroup />
    </div>
  );
};