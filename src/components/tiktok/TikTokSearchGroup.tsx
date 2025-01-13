import { TikTokSearchForm } from "./TikTokSearchForm";
import { TikTokSearchSettings } from "./TikTokSearchSettings";
import { TikTokRecentSearches } from "./TikTokRecentSearches";

export const TikTokSearchGroup = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TikTokSearchForm />
      <TikTokSearchSettings
        isSettingsOpen={false}
        setIsSettingsOpen={() => {}}
        numberOfVideos={10}
        setNumberOfVideos={() => {}}
      />
      <TikTokRecentSearches onSelect={() => {}} />
    </div>
  );
};