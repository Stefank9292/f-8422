import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface FilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isDatePicker?: boolean;
  helpText?: string;
}

export const FilterInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isDatePicker,
  helpText,
}: FilterInputProps) => {
  const [date, setDate] = useState<Date>();

  const handleNumericInput = (inputValue: string) => {
    // Only allow numbers and empty string
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  if (isDatePicker) {
    return (
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
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
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  onChange(format(newDate, "dd.MM.yyyy"));
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {helpText && (
          <p className="text-[10px] text-muted-foreground">{helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => {
          if (type === "number") {
            handleNumericInput(e.target.value);
          } else {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        className="h-8"
      />
      {helpText && (
        <p className="text-[10px] text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};