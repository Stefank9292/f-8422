import { BrandTiktok } from "lucide-react";

export const TikTokSearchHeader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/5 animate-in fade-in duration-300">
        <BrandTiktok className="w-4 h-4" />
        <span className="text-sm font-medium">TikTok Search</span>
      </div>
    </div>
  );
};