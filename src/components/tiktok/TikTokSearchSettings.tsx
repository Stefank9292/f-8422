import { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoCountSlider } from "./search-settings/VideoCountSlider";
import { DateRangeSelect } from "./search-settings/DateRangeSelect";
import { LocationSelect } from "./search-settings/LocationSelect";

export type DateRangeOption = "DEFAULT" | "THIS_WEEK" | "THIS_MONTH" | "LAST_THREE_MONTHS";
export type LocationOption = "US" | "DE";

interface TikTokSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  location: LocationOption;
  setLocation: (location: LocationOption) => void;
  disabled?: boolean;
}

export const TikTokSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  dateRange,
  setDateRange,
  location,
  setLocation,
  disabled = false,
}: TikTokSearchSettingsProps) => {
  const [localNumberOfVideos, setLocalNumberOfVideos] = useState(numberOfVideos);

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
  });

  const getMaxVideos = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
        subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") return 50;
    if (subscriptionStatus.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
        subscriptionStatus.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h") return 25;
    return 5;
  };

  const maxVideos = getMaxVideos();

  useEffect(() => {
    if (localNumberOfVideos > maxVideos) {
      setLocalNumberOfVideos(maxVideos);
      setNumberOfVideos(maxVideos);
    }
  }, [subscriptionStatus?.priceId]);

  const handleSliderChange = (value: number[]) => {
    setLocalNumberOfVideos(value[0]);
  };

  const handleSliderPointerUp = () => {
    // Only update parent state when the user finishes dragging
    setNumberOfVideos(localNumberOfVideos);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs text-gray-700 dark:text-gray-200 
                 bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 
                 transition-colors rounded-lg backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80"
        disabled={disabled}
      >
        <Settings2 className="w-4 h-4" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-3 p-4 space-y-5 bg-white/90 dark:bg-gray-800/90 rounded-xl 
                      border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in duration-200
                      w-full max-w-md mx-auto backdrop-blur-sm shadow-lg">
          <VideoCountSlider
            localNumberOfVideos={localNumberOfVideos}
            maxVideos={maxVideos}
            onSliderChange={handleSliderChange}
            onSliderPointerUp={handleSliderPointerUp}
            disabled={disabled}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateRangeSelect
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              disabled={disabled}
            />
            <LocationSelect
              location={location}
              onLocationChange={setLocation}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};