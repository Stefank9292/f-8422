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
  // Helper function to extract username from TikTok URL
  const getUsername = (post: any): string => {
    try {
      // Extract username from the postPage URL
      const url = post.postPage;
      if (!url) return 'Unknown';
      
      // URL format: https://www.tiktok.com/@username/video/...
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

  const truncatedCaption = post.title.length > 15 
    ? `${post.title.substring(0, 15)}...` 
    : post.title;

  return (
    <TableRow className="hover:bg-muted/30 transition-colors duration-200">
      <TableCell className="py-4 text-xs text-muted-foreground">
        @{getUsername(post)}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-xs text-muted-foreground">
                {truncatedCaption}
              </span>
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
            className="h-6 w-6 rounded-md hover:bg-muted transition-colors duration-200"
            onClick={() => onCopyCaption(post.title)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center py-4 text-xs text-muted-foreground">
        {new Date(post.uploadedAtFormatted).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-green-500">
        {formatNumber(post.views)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-violet-500">
        {formatNumber(post.shares)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-rose-500">
        {formatNumber(post.likes)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-blue-400">
        {formatNumber(post.comments)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-orange-500">
        {Math.round((post.likes / post.views) * 100)}%
      </TableCell>
      <TableCell className="text-center py-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted transition-colors duration-200"
          onClick={() => window.open(post.postPage, '_blank')}
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
        </Button>
      </TableCell>
    </TableRow>
  );
};