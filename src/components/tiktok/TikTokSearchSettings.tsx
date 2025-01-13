interface TikTokSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  disabled?: boolean;
}

export function TikTokSearchSettings(props: TikTokSearchSettingsProps) {
  return (
    <div>
      {/* Implementation coming soon */}
    </div>
  );
}