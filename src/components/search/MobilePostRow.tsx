import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink, ChevronDown, Eye, Play, Heart, MessageSquare, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobilePostRowProps {
  post: any;
  onCopyCaption: (caption: string) => void;
  onDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const MobilePostRow = ({
  post,
  onCopyCaption,
  onDownload,
  formatNumber,
  truncateCaption,
}: MobilePostRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format engagement rate to always show 2 decimal places
  const formattedEngagement = typeof post.engagement === 'string' 
    ? `${parseFloat(post.engagement).toFixed(2)}%`
    : `${post.engagement.toFixed(2)}%`;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg bg-card text-card-foreground shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-start justify-between p-4 hover:bg-muted/50">
        <div className="flex flex-col items-start gap-2">
          <span className="text-sm font-medium">@{post.ownerUsername}</span>
          <div className="flex items-start gap-2 w-full">
            <p className="text-xs text-muted-foreground line-clamp-3 text-left flex-1">{post.caption}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onCopyCaption(post.caption);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-[10px] text-muted-foreground">{post.date}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 mt-1",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs font-medium text-green-500">
              {formatNumber(post.playsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              {formatNumber(post.viewsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">
              {formatNumber(post.likesCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">
              {formatNumber(post.commentsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-medium text-orange-500">
              {formattedEngagement}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => window.open(post.url, '_blank')}
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Open
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => onDownload(post.videoUrl)}
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};