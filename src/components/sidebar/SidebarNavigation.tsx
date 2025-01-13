import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = isMobile && state === "collapsed";

  return (
    <div className="px-2 py-4">
      <div className={cn(
        "relative flex items-center",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <h1 className={cn(
          "text-xl font-bold bg-gradient-to-r from-[#D946EF] via-[#FF3D77] to-[#FF8A3D] bg-clip-text text-transparent",
          isCollapsed ? "text-center" : "text-left"
        )}>
          VyralSearch
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-[11px] bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border-none px-2 py-0.5 rounded-lg font-medium cursor-help",
                  isCollapsed ? "absolute -top-1 right-0" : "ml-2"
                )}
              >
                BETA
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] p-4">
              <div className="space-y-2">
                <p className="text-[11px]">
                  You've unlocked a discount code – Time to level up! 🎉 Enjoy 25% off the{' '}
                  <span className="font-bold bg-gradient-to-r from-[#D946EF] via-[#FF3D77] to-[#FF8A3D] bg-clip-text text-transparent">
                    Creator on Steroids
                  </span>{' '}
                  Plan for your first month! 🚀
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className={cn(
        "mt-1",
        isCollapsed ? "hidden" : "block"
      )}>
        <div className="instagram-gradient text-[11px] font-medium text-white rounded-md py-0.5 px-2 inline-block shadow-sm hover:opacity-95 transition-opacity">
          Video Research on Steroids
        </div>
      </div>
    </div>
  );
}