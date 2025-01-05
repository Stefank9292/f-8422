import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Settings2, HelpCircle, Lock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";

interface BulkSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const BulkSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
  disabled = false,
}: BulkSearchSettingsProps) => {
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

  const isFreeUser = !subscriptionStatus?.subscribed;

  const getMaxVideos = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1QdtwnGX13ZRG2XihcM36r3W" || 
        subscriptionStatus.priceId === "price_1Qdtx2GX13ZRG2XieXrqPxAV") return 20;
    if (subscriptionStatus.priceId === "price_1Qdty5GX13ZRG2XiFxadAKJW" || 
        subscriptionStatus.priceId === "price_1QdtyHGX13ZRG2Xib8px0lu0") return 50;
    return 5;
  };

  const maxVideos = getMaxVideos();

  const handleSliderChange = (value: number[]) => {
    setLocalNumberOfVideos(value[0]);
  };

  const handleSliderPointerUp = () => {
    setNumberOfVideos(localNumberOfVideos);
  };

  return (
    <div className="w-full mx-auto">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full flex items-center justify-center gap-2 py-3 sm:py-2 text-[11px] text-gray-700 dark:text-gray-200 
                 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-3 p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg 
                      border border-gray-200/80 dark:border-gray-800/80 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-[11px] font-medium">Number of Videos per Profile</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">Maximum number of videos to fetch per profile</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm sm:text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {localNumberOfVideos}
              </span>
            </div>
            <Slider
              value={[localNumberOfVideos]}
              onValueChange={(value) => setLocalNumberOfVideos(value[0])}
              onPointerUp={() => setNumberOfVideos(localNumberOfVideos)}
              min={1}
              max={maxVideos}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-sm sm:text-[11px] font-medium">Posts newer than</span>
              {isFreeUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">Upgrade to filter by date</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {!isFreeUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">Limited to posts from the last 90 days</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-10 justify-start text-sm sm:text-[11px] font-normal",
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
                  />
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};