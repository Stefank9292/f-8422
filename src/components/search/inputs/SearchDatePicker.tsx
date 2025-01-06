import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SearchDatePickerProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
}

export const SearchDatePicker = ({
  icon: Icon,
  label,
  value,
  onChange,
  helpText,
}: SearchDatePickerProps) => {
  const date = value ? new Date(value.split('.').reverse().join('-')) : undefined;

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onChange(format(newDate, "dd.MM.yyyy"));
    }
  };

  const handleResetDate = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Label>
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd.MM.yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {date && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleResetDate}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Reset date</span>
          </Button>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};