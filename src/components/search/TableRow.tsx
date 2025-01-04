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
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <TableCell className="py-4 text-gray-600 dark:text-gray-400 font-medium">
        @{post.ownerUsername}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-gray-600 dark:text-gray-400">
                {truncateCaption(post.caption)}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="break-words">{post.caption}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onCopyCaption(post.caption)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center py-4 text-gray-500" title={post.timestamp}>
        {post.date}
      </TableCell>
      <TableCell className="text-center py-4 text-green-500 font-medium">
        {formatNumber(post.playsCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-blue-500 font-medium">
        {formatNumber(post.viewsCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-rose-500 font-medium">
        {formatNumber(post.likesCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-blue-400 font-medium">
        {formatNumber(post.commentsCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-orange-500 font-medium">
        {post.engagement}
      </TableCell>
      <TableCell className="text-center py-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => window.open(post.url, '_blank')}
        >
          <ExternalLink className="w-4 h-4 text-rose-400" />
        </Button>
      </TableCell>
      <TableCell className="text-center py-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => onDownload(post.videoUrl)}
        >
          <Download className="w-4 h-4 text-blue-400" />
        </Button>
      </TableCell>
    </TableRow>
  );
};