import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, HelpCircle, Calendar, MapPin, SlidersHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TikTokSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  numberOfVideos: number;
  setNumberOfVideos: (num: number) => void;
  disabled?: boolean;
}

export const TikTokSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  numberOfVideos,
  setNumberOfVideos,
  disabled = false,
}: TikTokSearchSettingsProps) => {
  const [localNumberOfVideos, setLocalNumberOfVideos] = useState(numberOfVideos);

  const handleSliderChange = (value: number[]) => {
    setLocalNumberOfVideos(value[0]);
  };

  const handleSliderPointerUp = () => {
    setNumberOfVideos(localNumberOfVideos);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] text-muted-foreground
                 bg-accent/50 hover:bg-accent/80 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-3 p-4 space-y-4 bg-card rounded-lg border border-border/50 animate-in fade-in duration-200 w-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Number of Videos per Profile</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">Maximum number of videos to fetch per profile</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-[11px] font-medium bg-accent/50 px-2 py-0.5 rounded">
                {localNumberOfVideos}
              </span>
            </div>
            <Slider
              value={[localNumberOfVideos]}
              onValueChange={handleSliderChange}
              onPointerUp={handleSliderPointerUp}
              min={1}
              max={50}
              step={1}
              disabled={disabled}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Date Filter</span>
            </div>
            <Select disabled={disabled}>
              <SelectTrigger className="w-full h-9 text-xs border border-border/50">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Location</span>
            </div>
            <Select disabled={disabled}>
              <SelectTrigger className="w-full h-9 text-xs border border-border/50">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worldwide">Worldwide</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};