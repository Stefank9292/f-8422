import { useState } from "react";
import { Copy, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BulkSearchInfoProps {
  urls: string[];
}

export function BulkSearchInfo({ urls }: BulkSearchInfoProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrls = () => {
    navigator.clipboard.writeText(urls.join('\n'));
    setIsCopied(true);
    toast({
      description: "URLs copied to clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!urls || urls.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {urls.length}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[300px]">
          <div className="space-y-2">
            <div className="text-sm font-medium">Bulk Search URLs:</div>
            <div className="space-y-1">
              {urls.map((url, index) => (
                <div key={index} className="text-xs">{url}</div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-full text-xs"
              onClick={handleCopyUrls}
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              {isCopied ? "Copied!" : "Copy URLs"}
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}