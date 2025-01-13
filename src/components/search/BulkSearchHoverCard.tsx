import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BulkSearchHoverCardProps } from "./types/searchTypes";

export const BulkSearchHoverCard = ({ urls, onCopyUrls }: BulkSearchHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1 bg-secondary/50 px-1.5 py-0.5 rounded-full">
          +{urls.length - 1}
        </span>
      </HoverCardTrigger>
      <HoverCardContent 
        align="start"
        className="w-80 p-4"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bulk Search URLs</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-secondary/80"
              onClick={() => onCopyUrls(urls)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy URLs</span>
            </Button>
          </div>
          <ul className="list-none space-y-0.5">
            {urls.map((url: string, index: number) => (
              <li 
                key={index} 
                className="text-xs text-muted-foreground break-all py-0.5 text-left"
              >
                {url}
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};