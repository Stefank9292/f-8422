import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";

export const SearchHeader = () => {
  const copyDiscountCode = () => {
    navigator.clipboard.writeText("VYRAL25");
    toast.success("Discount code copied to clipboard!");
  };

  return (
    <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6">
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
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm cursor-not-allowed"
        >
          <Youtube className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-400">YouTube</span>
          <span className="text-[11px] text-gray-400 ml-1">Coming Soon</span>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm cursor-not-allowed"
        >
          <Facebook className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-400">Facebook</span>
          <span className="text-[11px] text-gray-400 ml-1">Coming Soon</span>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm cursor-not-allowed"
        >
          <Twitter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-400">Twitter</span>
          <span className="text-[11px] text-gray-400 ml-1">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};