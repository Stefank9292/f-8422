import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { Badge } from "@/components/ui/badge";

export const SearchHeader = () => {
  return (
    <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
      <div className="relative inline-block">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#8B3DFF] via-[#FF3D77] to-[#FF8A3D] bg-clip-text text-transparent">
          VyralSearch
        </h1>
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-12 text-[11px] bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border-none px-2 py-0.5 rounded-lg font-medium"
        >
          BETA
        </Badge>
      </div>
      <div className="mt-2">
        <span className="px-4 py-1.5 text-[13px] font-medium text-white rounded-full bg-gradient-to-r from-[#8B3DFF] via-[#FF3D77] to-[#FF8A3D]">
          Video Research on Steroids
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mt-6">
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm"
        >
          <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
          <span className="text-[11px] font-medium text-gray-800 dark:text-gray-200">Instagram</span>
        </a>
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm cursor-not-allowed"
        >
          <TikTokIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-400">TikTok</span>
          <span className="text-[11px] text-gray-400 ml-1">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};