import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink, Eye, Heart, MessageSquare, Share2, Zap } from "lucide-react";

interface TikTokMobilePostRowProps {
  post: any;
  onCopyCaption: (caption: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const TikTokMobilePostRow = ({
  post,
  onCopyCaption,
  formatNumber,
  truncateCaption
}: TikTokMobilePostRowProps) => {
  // Helper function to extract username from TikTok URL
  const getUsername = (post: any): string => {
    try {
      const url = post.postPage;
      if (!url) return 'Unknown';
      
      const match = url.match(/@([^/]+)/);
      if (match && match[1]) {
        return match[1];
      }
      
      return 'Unknown';
    } catch (error) {
      console.error('Error extracting username:', error);
      return 'Unknown';
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium">@{getUsername(post)}</p>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground truncate cursor-help">
                  {truncateCaption(post.title)}
                </p>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="start"
                className="max-w-sm z-[100] bg-popover shadow-lg"
                sideOffset={5}
              >
                <p className="break-words text-xs">{post.title}</p>
              </TooltipContent>
            </Tooltip>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-muted transition-colors duration-200 shrink-0"
              onClick={() => onCopyCaption(post.title)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(post.uploadedAtFormatted).toLocaleDateString()}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-md hover:bg-muted transition-colors duration-200"
          onClick={() => window.open(post.postPage, '_blank')}
        >
          <ExternalLink className="w-4 h-4 text-rose-400" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Eye className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs font-medium text-green-500">
              {formatNumber(post.views)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Views</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Share2 className="h-3.5 w-3.5 text-violet-500" />
            <span className="text-xs font-medium text-violet-500">
              {formatNumber(post.shares)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Shares</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">
              {formatNumber(post.likes)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Likes</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">
              {formatNumber(post.comments)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Comments</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-medium text-orange-500">
              {Math.round((post.likes / post.views) * 100)}%
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Engagement</p>
        </div>
      </div>
    </Card>
  );
};