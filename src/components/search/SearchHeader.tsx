import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { Badge } from "@/components/ui/badge";

export const SearchHeader = () => {
  return (
    <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          VyralSearch
        </h1>
        <Badge variant="secondary" className="text-xs md:text-sm bg-gradient-to-r from-purple-600 to-orange-400 text-white border-none">
          BETA
        </Badge>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-6">
        <a
          href="#"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <Instagram className="w-5 h-5" />
          <span className="text-sm md:text-base">Instagram</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-gray-400 cursor-not-allowed"
        >
          <TikTokIcon className="w-5 h-5" />
          <span className="text-sm md:text-base">TikTok Coming Soon</span>
        </a>
      </div>
    </div>
  );
};