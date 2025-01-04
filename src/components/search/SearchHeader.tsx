import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { Badge } from "@/components/ui/badge";

export const SearchHeader = () => {
  return (
    <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
      <div className="relative inline-block">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[#8B3DFF] via-[#FF3D77] to-[#FF8A3D] bg-clip-text text-transparent">
          VyralSearch
        </h1>
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-16 text-sm bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border-none px-3 py-1 rounded-lg font-medium"
        >
          BETA
        </Badge>
        <div className="mt-4">
          <span className="px-6 py-2 text-lg md:text-xl text-white rounded-full bg-gradient-to-r from-[#8B3DFF] via-[#FF3D77] to-[#FF8A3D]">
            Video Research on Steroids
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-6">
        <a
          href="#"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <Instagram className="w-5 h-5 text-[#E1306C]" />
          <span className="text-base font-medium text-gray-800 dark:text-gray-200">Instagram</span>
        </a>
        <div
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 shadow-sm cursor-not-allowed"
        >
          <TikTokIcon className="w-5 h-5 text-gray-400" />
          <span className="text-base font-medium text-gray-400">TikTok</span>
          <span className="text-sm text-gray-400 ml-1">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};