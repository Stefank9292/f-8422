import { Instagram } from "lucide-react";
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
      <div className="relative inline-block">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#8B3DFF] via-[#FF3D77] to-[#FF8A3D] bg-clip-text text-transparent">
          VyralSearch
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-12 text-[11px] bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border-none px-2 py-0.5 rounded-lg font-medium cursor-help"
              >
                BETA
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] p-4">
              <div className="space-y-2">
                <p className="text-[11px]">You found a discount code – Gotta catch&apos;em all! Here is your 25% discount on Ultra plan for the first month! 🎉</p>
                <button
                  onClick={copyDiscountCode}
                  className="w-full p-2 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                >
                  <code className="text-sm font-bold text-primary">VYRAL25</code>
                </button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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