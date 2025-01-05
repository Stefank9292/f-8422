import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Download, ExternalLink, Play, Eye, Heart, MessageCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostTableRowProps {
  post: any;
  onCopyCaption: (caption: string) => void;
  onDownload: (videoUrl: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const PostTableRow = ({ 
  post, 
  onCopyCaption, 
  onDownload,
  formatNumber,
  truncateCaption 
}: PostTableRowProps) => {
  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="py-3 text-xs text-muted-foreground font-medium">
        <div className="flex flex-col space-y-4">
          {/* Username and Caption Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>@{post.ownerUsername}</span>
              <span className="text-muted-foreground">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate cursor-help text-xs text-muted-foreground">
                    {truncateCaption(post.caption)}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="break-words text-xs">{post.caption}</p>
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md hover:bg-muted"
                onClick={() => onCopyCaption(post.caption)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Play className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-medium">{formatNumber(post.playsCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">{formatNumber(post.viewsCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span className="text-xs font-medium">{formatNumber(post.likesCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-medium">{formatNumber(post.commentsCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-xs font-medium">{post.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-xs font-medium">{post.engagement}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-xs font-medium"
              onClick={() => window.open(post.url, '_blank')}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-2 text-rose-400" />
              Open
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-xs font-medium"
              onClick={() => onDownload(post.videoUrl)}
            >
              <Download className="w-3.5 h-3.5 mr-2 text-blue-400" />
              Download
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};