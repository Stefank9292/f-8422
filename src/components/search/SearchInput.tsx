import { usePlatformStore } from "@/store/platformStore";
import { SearchBar } from "./SearchBar";
import { TikTokSearchBar } from "./tiktok/TikTokSearchBar";
import { useEffect } from "react";

interface SearchInputProps {
  instagramUsername: string;
  tiktokUsername: string;
  onSearch: () => void;
  onBulkSearch: (urls: string[], numVideos: number, date: Date | undefined) => Promise<any>;
  isLoading: boolean;
  isBulkSearching: boolean;
  setInstagramUsername: (username: string) => void;
  setTiktokUsername: (username: string) => void;
  hasReachedLimit: boolean;
}

export const SearchInput = ({
  instagramUsername,
  tiktokUsername,
  onSearch,
  onBulkSearch,
  isLoading,
  isBulkSearching,
  setInstagramUsername,
  setTiktokUsername,
  hasReachedLimit
}: SearchInputProps) => {
  const { platform } = usePlatformStore();

  // Auto-trigger search when platform changes and there's a username
  useEffect(() => {
    const currentUsername = platform === 'instagram' ? instagramUsername : tiktokUsername;
    if (currentUsername && !isLoading && !isBulkSearching && !hasReachedLimit) {
      onSearch();
    }
  }, [platform]);

  return platform === 'instagram' ? (
    <SearchBar
      username={instagramUsername}
      onSearch={onSearch}
      onBulkSearch={onBulkSearch}
      isLoading={isLoading || isBulkSearching}
      onUsernameChange={setInstagramUsername}
      hasReachedLimit={hasReachedLimit}
    />
  ) : (
    <TikTokSearchBar
      username={tiktokUsername}
      onSearch={onSearch}
      isLoading={isLoading}
      onUsernameChange={setTiktokUsername}
      hasReachedLimit={hasReachedLimit}
    />
  );
};