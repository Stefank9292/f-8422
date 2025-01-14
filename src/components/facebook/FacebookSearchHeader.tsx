import { Facebook } from "lucide-react";

export const FacebookSearchHeader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-sm 
                      border border-black/5 dark:border-white/5 animate-in fade-in duration-500 shadow-sm">
        <Facebook className="w-4 h-4 text-[#1877F2]" />
        <span className="text-sm font-medium">Facebook Search</span>
      </div>
    </div>
  );
};