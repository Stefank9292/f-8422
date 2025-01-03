import * as React from "react";
import { Settings, HelpCircle, Minus, Plus, Calendar as CalendarIcon } from "lucide-react";
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
}

export const SearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
}: SearchSettingsProps) => {
  // Calculate the date 90 days ago
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [date, setDate] = React.useState<Date | undefined>(undefined);

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
                  value={date ? format(date, 'dd.MM.yyyy') : ''}
                  className="pl-10"
                  readOnly
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
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