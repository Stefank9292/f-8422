import { useState, useEffect } from "react";
import { Settings2, HelpCircle } from "lucide-react";
import { VideoCountSlider } from "../settings/VideoCountSlider";
import { DateSelector } from "../settings/DateSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InstagramSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const InstagramSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
  disabled = false,
}: InstagramSearchSettingsProps) => {
  const [localNumberOfVideos, setLocalNumberOfVideos] = useState(numberOfVideos);
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

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

  useEffect(() => {
    const maxVideos = getMaxVideos();
    if (localNumberOfVideos > maxVideos) {
      setLocalNumberOfVideos(maxVideos);
      setNumberOfVideos(maxVideos);
    }
  }, [subscriptionStatus?.priceId]);

  const getMaxVideos = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
        subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") return 50;
    if (subscriptionStatus.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
        subscriptionStatus.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h") return 25;
    return 5;
  };

  const handleSliderChange = (value: number[]) => {
    setLocalNumberOfVideos(value[0]);
    setNumberOfVideos(value[0]);
  };

  const isFreeUser = !subscriptionStatus?.subscribed;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="inline-flex items-center justify-center gap-2 py-2 px-4 text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-2 p-3 space-y-4 bg-white dark:bg-gray-800 rounded-lg 
                      border border-gray-200/80 dark:border-gray-800/80 animate-in fade-in duration-200
                      w-full max-w-md mx-auto">
          <VideoCountSlider
            localNumberOfVideos={localNumberOfVideos}
            handleSliderChange={handleSliderChange}
            maxVideos={getMaxVideos()}
            disabled={disabled}
          />
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isFreeUser={isFreeUser}
            disabled={disabled}
            ninetyDaysAgo={ninetyDaysAgo}
          />
        </div>
      )}
    </div>
  );
};