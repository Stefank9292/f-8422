import { HelpCircle, Calendar as CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { LucideIcon } from "lucide-react";

interface FilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helpText?: string;
  type?: string;
  isDatePicker?: boolean;
}

export const FilterInput = ({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  isDatePicker = false
}: FilterInputProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'dd.MM.yyyy'));
    }
  };

  const handleResetDate = () => {
    onChange('');
  };

  if (isDatePicker) {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <label className="text-base font-medium">{label}</label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="text"
                placeholder={placeholder}
                value={value}
                className="h-12 rounded-xl text-sm pl-10"
                readOnly
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              {value && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={handleResetDate}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value.split('.').reverse().join('-')) : undefined}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date() || date < ninetyDaysAgo}
              initialFocus
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-muted-foreground">Limited to posts from the last 90 days</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <label className="text-base font-medium">{label}</label>
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl text-sm"
      />
    </div>
  );
};