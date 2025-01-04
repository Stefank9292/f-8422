import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export const SearchHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="relative">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent">
          VyralSearch
        </h1>
        <span className="absolute -top-2 right-0 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          BETA
        </span>
      </div>
      
      <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-orange-400">
        <span className="text-white text-sm font-medium">Video Research on Steroids</span>
      </div>

      <div className="flex items-center justify-center space-x-8 mt-6">
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <Instagram className="w-5 h-5" />
          <span>Instagram</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-400 cursor-not-allowed"
        >
          <TikTokIcon className="w-5 h-5" />
          <span>TikTok Coming Soon</span>
        </a>
      </div>
    </div>
  );
};