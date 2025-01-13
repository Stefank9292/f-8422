import { Instagram } from "lucide-react";

export const SearchHeader = () => {
  return (
    <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <a
          href="#"
          className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 
                   shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
        >
          <Instagram className="w-4 h-4 text-[#E1306C]" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Instagram</span>
        </a>
      </div>
    </div>
  );
};