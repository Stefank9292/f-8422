import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { LocationOption } from "../TikTokSearchSettings";

interface LocationSelectProps {
  location: LocationOption;
  onLocationChange: (value: LocationOption) => void;
  disabled?: boolean;
}

export const LocationSelect = ({
  location,
  onLocationChange,
  disabled = false
}: LocationSelectProps) => {
  const locationOptions = [
    { value: "US", label: "United States" },
    { value: "DE", label: "Germany" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-medium">Location</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[10px]">Select content location</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Select
        value={location}
        onValueChange={onLocationChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-8 text-[11px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {locationOptions.map((option) => (
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