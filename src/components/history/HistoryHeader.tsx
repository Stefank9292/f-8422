import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HistoryHeader() {
  return (
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold">Search History</h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-5 w-5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Search history is automatically deleted after 7 days</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}