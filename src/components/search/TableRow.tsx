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
    <TableRow>
      <TableCell>@{post.ownerUsername}</TableCell>
      <TableCell className="max-w-xs">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help">{truncateCaption(post.caption)}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="break-words">{post.caption}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onCopyCaption(post.caption)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center" title={post.timestamp}>{post.date}</TableCell>
      <TableCell className="text-center">{formatNumber(post.playsCount)}</TableCell>
      <TableCell className="text-center">{formatNumber(post.viewsCount)}</TableCell>
      <TableCell className="text-center">{formatNumber(post.likesCount)}</TableCell>
      <TableCell className="text-center">{formatNumber(post.commentsCount)}</TableCell>
      <TableCell className="text-center">{post.duration || '0:00'}</TableCell>
      <TableCell className="text-center">{post.engagement}</TableCell>
      <TableCell className="text-center">
        <Button variant="ghost" size="icon" onClick={() => window.open(post.url, '_blank')}>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </TableCell>
      <TableCell className="text-center">
        <Button variant="ghost" size="icon" onClick={() => onDownload(post.videoUrl)}>
          <Download className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};