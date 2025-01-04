import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Settings2, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { RecentSearchesCompact } from "./RecentSearchesCompact";

interface SearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
  onSearchSelect?: (username: string) => void;
}

export const SearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
  disabled = false,
  onSearchSelect
}: SearchSettingsProps) => {
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

  const getMaxVideos = () => {
    if (!subscriptionStatus?.priceId) return 5;
    if (subscriptionStatus.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") return 20;
    if (subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") return 50;
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
    <div className="w-full max-w-2xl mx-auto">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg border border-gray-200 dark:border-gray-700"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="font-medium">Search Settings</span>
        </div>
        {isSettingsOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isSettingsOpen && (
        <div className="mt-3 p-4 space-y-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
          {onSearchSelect && <RecentSearchesCompact onSearchSelect={onSearchSelect} />}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">Number of Videos</span>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Posts newer than</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
            <p className="text-xs text-gray-500">
              Limited to posts from the last 90 days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};