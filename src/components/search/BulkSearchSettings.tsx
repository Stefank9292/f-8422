import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Settings2, Minus, Plus, HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  disabled = false
}: BulkSearchSettingsProps) => {
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

  const getMaxVideos = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") return 20;
    if (subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") return 50;
    return 5;
  };

  const maxVideos = getMaxVideos();

  return (
    <div className="w-full mx-auto">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full flex items-center justify-center gap-2 py-2 text-[11px] text-gray-700 dark:text-gray-200 
                 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-2 p-3 space-y-4 bg-white dark:bg-gray-800 rounded-lg 
                      border border-gray-200/80 dark:border-gray-800/80 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium">Number of Videos per Profile</span>
                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {numberOfVideos}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50/50 dark:bg-gray-700/30 p-2 rounded">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNumberOfVideos(Math.max(1, numberOfVideos - 1))}
                disabled={numberOfVideos <= 1 || disabled}
                className="h-7 w-7 rounded"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium min-w-[2ch] text-center">
                {numberOfVideos}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNumberOfVideos(Math.min(maxVideos, numberOfVideos + 1))}
                disabled={numberOfVideos >= maxVideos || disabled}
                className="h-7 w-7 rounded"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] font-medium">Posts newer than</span>
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-8 justify-start text-[11px] font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
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
            </Popover>
            <p className="text-[11px] text-gray-500">
              Limited to posts from the last 90 days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};