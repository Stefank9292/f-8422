import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Download, ExternalLink, Play, Eye, Heart, MessageCircle, Clock, Zap } from "lucide-react";

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
    <>
      {/* Mobile View */}
      <TableRow className="hover:bg-muted/30 transition-colors md:hidden">
        <TableCell colSpan={10} className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Header: Username and Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">
                @{post.ownerUsername}
              </span>
              <span className="text-xs text-muted-foreground" title={post.timestamp}>
                {post.date}
              </span>
            </div>

            {/* Caption */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate cursor-help text-sm text-muted-foreground">
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">{formatNumber(post.playsCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{formatNumber(post.viewsCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium text-rose-500">{formatNumber(post.likesCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">{formatNumber(post.commentsCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-500">{post.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-500">{post.engagement}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-rose-400 border-rose-400/20 hover:bg-rose-400/10"
                onClick={() => window.open(post.url, '_blank')}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Open
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
                onClick={() => onDownload(post.videoUrl)}
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Desktop View */}
      <TableRow className="hover:bg-muted/30 transition-colors hidden md:table-row">
        <TableCell className="py-3 text-xs text-muted-foreground font-medium">
          @{post.ownerUsername}
        </TableCell>
        <TableCell className="max-w-xs py-3">
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
        </TableCell>
        <TableCell className="text-center py-3 text-xs text-muted-foreground" title={post.timestamp}>
          {post.date}
        </TableCell>
        <TableCell className="text-center py-3 text-xs font-medium text-green-500">
          {formatNumber(post.playsCount)}
        </TableCell>
        <TableCell className="text-center py-3 text-xs font-medium text-primary">
          {formatNumber(post.viewsCount)}
        </TableCell>
        <TableCell className="text-center py-3 text-xs font-medium text-rose-500">
          {formatNumber(post.likesCount)}
        </TableCell>
        <TableCell className="text-center py-3 text-xs font-medium text-blue-400">
          {formatNumber(post.commentsCount)}
        </TableCell>
        <TableCell className="text-center py-3 text-xs font-medium text-orange-500">
          {post.engagement}
        </TableCell>
        <TableCell className="text-center py-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-muted"
            onClick={() => window.open(post.url, '_blank')}
          >
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
          </Button>
        </TableCell>
        <TableCell className="text-center py-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-muted"
            onClick={() => onDownload(post.videoUrl)}
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};