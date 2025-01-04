import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, HelpCircle, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Search Settings</span>
        </div>
        {isSettingsOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isSettingsOpen && (
        <div className="p-4 space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">Number of Videos</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNumberOfVideos(Math.max(1, numberOfVideos - 1))}
                disabled={numberOfVideos <= 1 || disabled}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-medium min-w-[2ch] text-center">
                {numberOfVideos}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNumberOfVideos(numberOfVideos + 1)}
                disabled={disabled}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-base font-medium">Posts newer than</span>
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "Pick a date"}
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
      )}
    </div>
  );
};