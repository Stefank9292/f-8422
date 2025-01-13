import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

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
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-2 sm:mt-3 p-2.5 sm:p-4 space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 rounded-lg 
                      border border-gray-200/80 dark:border-gray-800/80 animate-in fade-in duration-200
                      w-full">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-[11px] font-medium">Number of Videos per Profile</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[9px] sm:text-[10px]">Maximum number of videos to fetch per profile</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
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
        </div>
      )}
    </div>
  );
};