import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";

interface VideoCountSliderProps {
  localNumberOfVideos: number;
  handleSliderChange: (value: number[]) => void;
  maxVideos: number;
  disabled?: boolean;
}

export const VideoCountSlider = ({
  localNumberOfVideos,
  handleSliderChange,
  maxVideos,
  disabled = false,
}: VideoCountSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium">Number of Videos</span>
          <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {localNumberOfVideos}
        </span>
      </div>
      <Slider
        value={[localNumberOfVideos]}
        onValueChange={handleSliderChange}
        min={1}
        max={maxVideos}
        step={1}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
};