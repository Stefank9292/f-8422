import { Calendar as CalendarIcon, HelpCircle, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isFreeUser: boolean;
  disabled?: boolean;
  ninetyDaysAgo: Date;
}

export const DateSelector = ({
  selectedDate,
  setSelectedDate,
  isFreeUser,
  disabled = false,
  ninetyDaysAgo,
}: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-[11px] font-medium">Posts newer than</span>
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
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-8 justify-start text-[11px] font-normal",
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
                disabled={(date) => date > new Date() || date < ninetyDaysAgo}
                initialFocus
              />
            </PopoverContent>
          )}
        </Popover>
        {selectedDate && !isFreeUser && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 hover:bg-muted"
            onClick={() => setSelectedDate(undefined)}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear date</span>
          </Button>
        )}
      </div>
    </div>
  );
};