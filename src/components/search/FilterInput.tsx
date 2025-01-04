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
  helpText,
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
    // Calculate the date 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium">{label}</label>
          {helpText && <HelpCircle className="w-4 h-4 text-gray-400" />}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="text"
                placeholder={placeholder}
                value={value}
                className="pl-10"
                readOnly
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              {value && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleResetDate}
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
                  onClick={() => handleDateSelect(new Date())}
                  className="text-sm"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetDate}
                  className="text-sm"
                >
                  Reset
                </Button>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={value ? new Date(value.split('.').reverse().join('-')) : undefined}
              onSelect={handleDateSelect}
              disabled={(date) => {
                return date > new Date() || date < ninetyDaysAgo;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <label className="text-sm font-medium">{label}</label>
        {helpText && <HelpCircle className="w-4 h-4 text-gray-400" />}
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};