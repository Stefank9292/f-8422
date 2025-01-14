import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    setNumberOfVideos(localNumberOfVideos);
  };

  const dateRangeOptions = [
    { value: "DEFAULT", label: "Default" },
    { value: "THIS_WEEK", label: "This Week" },
    { value: "THIS_MONTH", label: "This Month" },
    { value: "LAST_THREE_MONTHS", label: "Last Three Months" },
  ];

  const locationOptions = [
    { value: "US", label: "United States" },
    { value: "DE", label: "Germany" },
  ];

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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium">Number of Videos</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">Maximum number of videos to fetch</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {localNumberOfVideos}
              </span>
            </div>
            <Slider
              value={[localNumberOfVideos]}
              onValueChange={handleSliderChange}
              onPointerUp={handleSliderPointerUp}
              min={1}
              max={maxVideos}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">Date Range</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px]">Filter posts by date range</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={dateRange}
              onValueChange={(value: DateRangeOption) => setDateRange(value)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-[11px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[11px]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">Location</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px]">Select content location</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={location}
              onValueChange={(value: LocationOption) => setLocation(value)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-[11px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[11px]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};