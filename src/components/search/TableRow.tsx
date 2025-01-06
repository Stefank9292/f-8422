import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  truncateCaption,
}: PostTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <span className="text-sm">@{post.ownerUsername}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 max-w-[200px]">
          <span className="text-sm truncate">{truncateCaption(post.caption)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onCopyCaption(post.caption)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <span className="text-sm">{new Date(post.date).toLocaleDateString()}</span>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger className="text-sm">{formatNumber(post.viewsCount)}</TooltipTrigger>
          <TooltipContent>Views</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger className="text-sm">{formatNumber(post.playsCount)}</TooltipTrigger>
          <TooltipContent>Plays</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger className="text-sm">{formatNumber(post.likesCount)}</TooltipTrigger>
          <TooltipContent>Likes</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger className="text-sm">{formatNumber(post.commentsCount)}</TooltipTrigger>
          <TooltipContent>Comments</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Tooltip>
          <TooltipTrigger className="text-sm">{post.engagement}</TooltipTrigger>
          <TooltipContent>Engagement Rate</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 mx-auto"
          onClick={() => window.open(post.url, '_blank')}
        >
          <ExternalLink className="h-3.5 w-3.5 text-rose-400" />
        </Button>
      </TableCell>
      <TableCell className="text-center">
        {post.videoUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 mx-auto"
            onClick={() => onDownload(post.videoUrl)}
          >
            <Download className="h-3.5 w-3.5 text-blue-400" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};