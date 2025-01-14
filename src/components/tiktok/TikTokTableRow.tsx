import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink } from "lucide-react";

interface TikTokTableRowProps {
  post: any;
  onCopyCaption: (caption: string) => void;
  formatNumber: (num: number) => string;
  truncateCaption: (caption: string) => string;
}

export const TikTokTableRow = ({ 
  post, 
  onCopyCaption,
  formatNumber,
  truncateCaption 
}: TikTokTableRowProps) => {
  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="py-4 text-xs text-muted-foreground font-medium">
        @{post.authorUsername}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-xs text-muted-foreground">
                {post.description.slice(0, 15)}...
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="break-words text-xs">{post.description}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-muted"
            onClick={() => onCopyCaption(post.description)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center py-4 text-xs text-muted-foreground align-middle">
        {post.createTime}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-green-500 align-middle">
        {formatNumber(post.playCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-primary align-middle">
        {formatNumber(post.viewCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-rose-500 align-middle">
        {formatNumber(post.likeCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-blue-400 align-middle">
        {formatNumber(post.commentCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-orange-500 align-middle">
        {post.engagement}%
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={() => window.open(post.webVideoUrl, '_blank')}
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
        </Button>
      </TableCell>
    </TableRow>
  );
};