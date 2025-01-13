import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Settings2, HelpCircle, Lock, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isTikTokUrl } from "@/utils/tiktok/validation";

interface BulkSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
  urls?: string[];
}

type DateRange = "DEFAULT" | "ALL_TIME" | "YESTERDAY" | "THIS_WEEK" | "THIS_MONTH" | "LAST_THREE_MONTHS";

export const BulkSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
  disabled = false,
  urls = [],
}: BulkSearchSettingsProps) => {
  const [localNumberOfVideos, setLocalNumberOfVideos] = useState(numberOfVideos);
  const [dateRange, setDateRange] = useState<DateRange>("DEFAULT");
  const [location, setLocation] = useState("US");
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const isTikTok = urls.some(url => isTikTokUrl(url));

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

  const isFreeUser = !subscriptionStatus?.subscribed;

  const getMaxVideos = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
        subscriptionStatus.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk") return 50;
    if (subscriptionStatus.priceId === "price_1QfKMGGX13ZRG2XiFyskXyJo" || 
        subscriptionStatus.priceId === "price_1QfKMYGX13ZRG2XioPYKCe7h") return 25;
    return 5;
  };

  const maxVideos = getMaxVideos();

  const handleSliderChange = (value: number[]) => {
    setLocalNumberOfVideos(value[0]);
  };

  const handleSliderPointerUp = () => {
    setNumberOfVideos(localNumberOfVideos);
  };

  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value);
    // Clear the calendar date when using predefined ranges for TikTok
    if (isTikTok) {
      setSelectedDate(undefined);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-2 sm:mt-3 p-2.5 sm:p-4 space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 rounded-lg 
                      border border-gray-200/80 dark:border-gray-800/80 animate-in fade-in duration-200
                      w-full">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-[11px] font-medium">Number of Videos per Profile</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[9px] sm:text-[10px]">Maximum number of videos to fetch per profile</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
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
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
              <span className="text-[10px] sm:text-[11px] font-medium">Date Range</span>
              {isFreeUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[9px] sm:text-[10px]">Upgrade to filter by date</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {isTikTok ? (
              <Select
                value={dateRange}
                onValueChange={(value) => handleDateRangeChange(value as DateRange)}
                disabled={disabled || isFreeUser}
              >
                <SelectTrigger className="w-full h-8 text-[10px] sm:text-[11px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEFAULT">Default</SelectItem>
                  <SelectItem value="ALL_TIME">All Time</SelectItem>
                  <SelectItem value="YESTERDAY">Yesterday</SelectItem>
                  <SelectItem value="THIS_WEEK">This Week</SelectItem>
                  <SelectItem value="THIS_MONTH">This Month</SelectItem>
                  <SelectItem value="LAST_THREE_MONTHS">Last Three Months</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-8 justify-start text-[10px] sm:text-[11px] font-normal",
                      !selectedDate && "text-muted-foreground",
                      isFreeUser && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled || isFreeUser}
                  >
                    {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                {!isFreeUser && (
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        date > new Date() || date < ninetyDaysAgo
                      }
                      initialFocus
                      className="rounded-lg border shadow-sm"
                    />
                  </PopoverContent>
                )}
              </Popover>
            )}
          </div>

          {isTikTok && (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                <span className="text-[10px] sm:text-[11px] font-medium">Location</span>
              </div>
              <Select
                value={location}
                onValueChange={setLocation}
                disabled={disabled}
              >
                <SelectTrigger className="w-full h-8 text-[10px] sm:text-[11px]">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};