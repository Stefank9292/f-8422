import { TikTokSearchHeader } from "./TikTokSearchHeader";
import { TikTokSearchBar } from "./TikTokSearchBar";
import { TikTokSearchSettings } from "./TikTokSearchSettings";
import { TikTokSearchResults } from "./TikTokSearchResults";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TikTokSearchContainer = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState(5);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('tiktok-scraper', {
        body: {
          username: username.trim(),
          numberOfVideos,
          selectedDate: selectedDate?.toISOString(),
        }
      });

      if (error) throw error;

      if (data.status === 'success') {
        setSearchResults(data.data);
        if (data.data.length === 0) {
          toast({
            description: "No results found for this profile",
          });
        }
      } else {
        throw new Error(data.message || 'Failed to fetch results');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch TikTok data",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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
          onSearch={handleSearch}
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

      <TikTokSearchResults searchResults={searchResults} />
    </div>
  );
};