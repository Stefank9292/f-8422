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
  // Helper function to safely get username from nested structure
  const getUsername = (post: any) => {
    // Try different possible paths for username
    const username = post.channel?.username || 
                    post['channel.username'] || 
                    post.channel?.name ||
                    post['channel.name'];
                    
    console.log('Username data:', { 
      channelUsername: post.channel?.username,
      channelDotUsername: post['channel.username'],
      channelName: post.channel?.name,
      channelDotName: post['channel.name'],
      finalUsername: username
    });
    
    return username || 'Unknown';
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors duration-200">
      <TableCell className="py-4 text-xs text-muted-foreground font-medium">
        @{getUsername(post)}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-xs text-muted-foreground">
                {truncateCaption(post.title)}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
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