import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export const SearchHeader = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
        VyralSearch
      </h1>
      <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-orange-400">
        <span className="text-white text-sm">Video Research on Steroids</span>
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4">
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Instagram className="w-5 h-5" />
          <span>Instagram</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <TikTokIcon className="w-5 h-5" />
          <span className="text-gray-400">TikTok Coming Soon</span>
        </a>
      </div>
    </div>
  );
};