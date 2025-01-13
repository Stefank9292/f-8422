import { Instagram } from "lucide-react";

export const SearchHeader = () => {
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
      </div>
    </div>
  );
};