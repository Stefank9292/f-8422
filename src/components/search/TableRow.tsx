import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Download, ExternalLink } from "lucide-react";
import { usePlatformStore } from "@/store/platformStore";

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
  const { platform } = usePlatformStore();
  
  // Format numbers with dots as thousand separators
  const formatNumberWithDots = (num: number) => {
    return num.toLocaleString('de-DE').replace(/,/g, '.');
  };

  // Format engagement rate to always show 2 decimal places
  const formattedEngagement = typeof post.engagement === 'string' 
    ? `${parseFloat(post.engagement).toFixed(2)}%`
    : `${post.engagement.toFixed(2)}%`;

  // Get the appropriate values based on platform
  const getDisplayValues = () => {
    if (platform === 'tiktok') {
      return {
        username: post.ownerUsername || '',
        caption: post.caption || '',
        views: post.viewsCount || 0,
        likes: post.likesCount || 0,
        shares: post.sharesCount || 0,
        comments: post.commentsCount || 0,
        date: post.date || '',
        externalUrl: post.url || '',
        downloadUrl: post.videoUrl || '',
        plays: post.playsCount || post.viewsCount || 0 // TikTok uses viewsCount
      };
    }
    return {
      username: post.ownerUsername || '',
      caption: post.caption || '',
      views: post.viewsCount || 0,
      likes: post.likesCount || 0,
      plays: post.playsCount || 0,
      comments: post.commentsCount || 0,
      date: post.date || '',
      externalUrl: post.url || '',
      downloadUrl: post.videoUrl || ''
    };
  };

  const displayValues = getDisplayValues();

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="py-4 text-xs text-muted-foreground font-medium">
        @{displayValues.username}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-xs text-muted-foreground">
                {platform === 'tiktok' 
                  ? `${displayValues.caption.slice(0, 15)}${displayValues.caption.length > 15 ? '...' : ''}`
                  : truncateCaption(displayValues.caption)
                }
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="break-words text-xs">{displayValues.caption}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-muted"
            onClick={() => onCopyCaption(displayValues.caption)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center py-4 text-xs text-muted-foreground align-middle">
        {displayValues.date}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-green-500 align-middle">
        {formatNumberWithDots(displayValues.views)}
      </TableCell>
      {platform === 'tiktok' ? (
        <TableCell className="text-center py-4 text-xs font-medium text-primary align-middle">
          {formatNumberWithDots(displayValues.shares)}
        </TableCell>
      ) : (
        <TableCell className="text-center py-4 text-xs font-medium text-primary align-middle">
          {formatNumberWithDots(displayValues.plays)}
        </TableCell>
      )}
      <TableCell className="text-center py-4 text-xs font-medium text-rose-500 align-middle">
        {formatNumberWithDots(displayValues.likes)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-blue-400 align-middle">
        {formatNumberWithDots(displayValues.comments)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-orange-500 align-middle">
        {formattedEngagement}
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={() => window.open(displayValues.externalUrl, '_blank')}
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
        </Button>
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={() => onDownload(displayValues.downloadUrl)}
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
        </Button>
      </TableCell>
    </TableRow>
  );
};