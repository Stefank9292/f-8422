import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink, Download } from "lucide-react";

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
        @{post.channel?.name || post.authorUsername}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-xs text-muted-foreground">
                {post.title || post.description}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="break-words text-xs">{post.title || post.description}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-muted"
            onClick={() => onCopyCaption(post.title || post.description)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center py-4 text-xs text-muted-foreground align-middle">
        {post.uploadedAtFormatted || post.createTime}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-green-500 align-middle">
        {formatNumber(post.views || post.playCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-blue-500 align-middle">
        {formatNumber(post.shares || post.shareCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-rose-500 align-middle">
        {formatNumber(post.likes || post.likeCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-blue-400 align-middle">
        {formatNumber(post.comments || post.commentCount)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-orange-500 align-middle">
        {post.engagement}%
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={() => window.open(post.postPage || post.webVideoUrl, '_blank')}
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
        </Button>
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={() => window.open(post.video?.url || post.videoUrl, '_blank')}
        >
          <Download className="w-3.5 h-3.5 text-emerald-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
};