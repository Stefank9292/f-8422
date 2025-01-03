import * as React from "react";
import { Settings, HelpCircle, Minus, Plus, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface SearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (value: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (value: number) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const SearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  selectedDate,
  setSelectedDate,
}: SearchSettingsProps) => {
  // Calculate the date 90 days ago
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const handleResetClick = () => {
    setSelectedDate(undefined);
  };

  return (
    <Collapsible
      open={isSettingsOpen}
      onOpenChange={setIsSettingsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 mx-auto text-gray-600"
        >
          <Settings className="w-4 h-4" />
          <span>Search Settings</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6 py-4 px-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Number of Videos</label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumberOfVideos(Math.max(1, numberOfVideos - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-xl font-medium w-8 text-center">{numberOfVideos}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumberOfVideos(Math.min(10, numberOfVideos + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Posts newer than</label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="dd.mm.yyyy"
                  value={selectedDate ? format(selectedDate, 'dd.MM.yyyy') : ''}
                  className="pl-10"
                  readOnly
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={handleResetClick}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b border-border">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTodayClick}
                    className="text-sm"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetClick}
                    className="text-sm"
                  >
                    Reset
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  return date > new Date() || date < ninetyDaysAgo;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-gray-500">Limited to posts from the last 90 days</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};