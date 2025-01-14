import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface VideoCountSliderProps {
  localNumberOfVideos: number;
  maxVideos: number;
  onSliderChange: (value: number[]) => void;
  onSliderPointerUp: () => void;
  disabled?: boolean;
}

export const VideoCountSlider = ({
  localNumberOfVideos,
  maxVideos,
  onSliderChange,
  onSliderPointerUp,
  disabled = false
}: VideoCountSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium">Number of Videos</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-[10px]">Maximum number of videos to fetch</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {localNumberOfVideos}
        </span>
      </div>
      <Slider
        value={[localNumberOfVideos]}
        onValueChange={onSliderChange}
        onPointerUp={onSliderPointerUp}
        min={1}
        max={maxVideos}
        step={1}
        disabled={disabled}
        className="w-full [&>.relative>.absolute]:bg-[#000000e6] [&>.relative]:bg-gray-200 dark:[&>.relative]:bg-gray-700
                   [&>button]:border-[#000000e6] [&>button]:bg-white dark:[&>button]:bg-gray-900
                   [&>button:focus-visible]:ring-[#000000e6] [&>button]:border-2"
      />
    </div>
  );
};