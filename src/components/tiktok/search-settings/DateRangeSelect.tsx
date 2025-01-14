import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { DateRangeOption } from "../TikTokSearchSettings";

interface DateRangeSelectProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (value: DateRangeOption) => void;
  disabled?: boolean;
}

export const DateRangeSelect = ({
  dateRange,
  onDateRangeChange,
  disabled = false
}: DateRangeSelectProps) => {
  const dateRangeOptions = [
    { value: "DEFAULT", label: "Default" },
    { value: "THIS_WEEK", label: "This Week" },
    { value: "THIS_MONTH", label: "This Month" },
    { value: "LAST_THREE_MONTHS", label: "Last Three Months" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-medium">Date Range</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[10px]">Filter posts by date range</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Select
        value={dateRange}
        onValueChange={onDateRangeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-8 text-[11px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-[11px]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};