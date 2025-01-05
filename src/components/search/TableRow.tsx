import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Download, ExternalLink } from "lucide-react";

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
  );
};