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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border border-border bg-card text-card-foreground shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50">
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-medium">@{post.ownerUsername}</span>
          <p className="text-xs text-muted-foreground line-clamp-2 text-left">{post.caption}</p>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              {formatNumber(post.playsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {formatNumber(post.viewsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium text-rose-500">
              {formatNumber(post.likesCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              {formatNumber(post.commentsCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">
              {post.engagement}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(post.url, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDownload(post.videoUrl)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onCopyCaption(post.caption)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};