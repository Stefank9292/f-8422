import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Settings2, ChevronDown, ChevronUp, Minus, Plus, HelpCircle } from "lucide-react";
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
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors rounded-lg"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          <span>Search Settings</span>
        </div>
        {isSettingsOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isSettingsOpen && (
        <div className="mt-4 p-4 space-y-6 bg-accent/50 backdrop-blur-sm rounded-lg border border-input animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Number of Videos per Profile</span>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-end gap-3 bg-background/50 p-2 rounded-lg">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumberOfVideos(Math.max(1, numberOfVideos - 1))}
                  disabled={numberOfVideos <= 1 || disabled}
                  className="h-8 w-8 rounded-md"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-lg font-medium min-w-[2ch] text-center">
                  {numberOfVideos}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumberOfVideos(Math.min(maxVideos, numberOfVideos + 1))}
                  disabled={numberOfVideos >= maxVideos || disabled}
                  className="h-8 w-8 rounded-md"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Posts newer than</span>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal py-4 text-sm rounded-lg",
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
              <p className="text-xs text-muted-foreground">
                Limited to posts from the last 90 days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};