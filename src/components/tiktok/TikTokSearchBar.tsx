interface TikTokSearchBarProps {
  username: string;
  onSearch: () => void;
  isLoading: boolean;
  onUsernameChange: (username: string) => void;
}

export function TikTokSearchBar({
  username,
  onSearch,
  isLoading,
  onUsernameChange,
}: TikTokSearchBarProps) {
  return (
    <div>
      {/* Implementation coming soon */}
    </div>
  );
}