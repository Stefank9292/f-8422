import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, LucideIcon, X } from "lucide-react";
import { useState, useEffect } from "react";

interface DatePickerInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const DatePickerInput = ({
  icon: Icon,
  label,
  value,
  onChange,
}: DatePickerInputProps) => {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (value) {
      try {
        const [day, month, year] = value.split('.');
        const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleResetDate = () => {
    setDate(undefined);
    onChange('');
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onChange(format(newDate, "dd.MM.yyyy"));
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-xs font-medium flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </Label>
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-9 text-xs border border-border/50",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
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
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 border border-border/50"
            onClick={handleResetDate}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Reset date</span>
          </Button>
        )}
      </div>
    </div>
  );
};