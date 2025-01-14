import { TikTokSearchHeader } from "./TikTokSearchHeader";
import { TikTokSearchBar } from "./TikTokSearchBar";
import { TikTokSearchSettings } from "./TikTokSearchSettings";
import { TikTokSearchResults } from "./TikTokSearchResults";
import { useState } from "react";

export const TikTokSearchContainer = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState(5);
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4 sm:space-y-6 w-full max-w-md">
        <TikTokSearchHeader />
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <TikTokSearchBar
          username={username}
          onUsernameChange={setUsername}
          isLoading={isLoading}
        />
        <TikTokSearchSettings 
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disabled={isLoading}
        />
      </div>

      <TikTokSearchResults />
    </div>
  );
};