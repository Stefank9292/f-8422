import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Settings2, ChevronDown, ChevronUp, Minus, Plus, HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const SearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
  disabled = false
}: SearchSettingsProps) => {
  // Calculate the date 90 days ago
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
    if (!subscriptionStatus?.priceId) return 5; // Free plan
    if (subscriptionStatus.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") return 20; // Premium plan
    if (subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") return 50; // Ultra plan
    return 5; // Default to free plan
  };

  const maxVideos = getMaxVideos();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          <span className="font-medium text-lg">Search Settings</span>
        </div>
        {isSettingsOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isSettingsOpen && (
        <div className="mt-4 p-6 space-y-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 animate-in fade-in duration-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Number of Videos</span>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumberOfVideos(Math.max(1, numberOfVideos - 1))}
                  disabled={numberOfVideos <= 1 || disabled}
                  className="h-10 w-10 rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium min-w-[2ch] text-center">
                  {numberOfVideos}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumberOfVideos(Math.min(maxVideos, numberOfVideos + 1))}
                  disabled={numberOfVideos >= maxVideos || disabled}
                  className="h-10 w-10 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Posts newer than</span>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal py-6 text-lg rounded-xl",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "tt.mm.jjjj"}
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
              <p className="text-sm text-gray-500">
                Limited to posts from the last 90 days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};