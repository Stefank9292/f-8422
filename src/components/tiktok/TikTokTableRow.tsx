import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  console.log('Post data:', post);

  const handleDownload = async () => {
    // If direct video URL is not available, notify user
    if (!post.video?.url) {
      toast({
        title: "Video URL not available",
        description: "Opening TikTok page instead. You can download the video from there.",
        variant: "default",
      });
      window.open(post.postPage, '_blank');
      return;
    }

    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = post.video.url;
      link.download = `tiktok-${post.id}.mp4`; // Set a filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download video. Try opening in TikTok instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="py-4 text-xs text-muted-foreground font-medium">
        @{post.channel?.username || 'Unknown'}
      </TableCell>
      <TableCell className="max-w-xs py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-help text-xs text-muted-foreground">
                {post.title?.slice(0, 15)}...
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="break-words text-xs">{post.title}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md hover:bg-muted"
            onClick={() => onCopyCaption(post.title)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center py-4 text-xs text-muted-foreground align-middle">
        {new Date(post.uploadedAtFormatted).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-green-500 align-middle">
        {formatNumber(post.views)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-violet-500 align-middle">
        {formatNumber(post.shares)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-rose-500 align-middle">
        {formatNumber(post.likes)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-blue-400 align-middle">
        {formatNumber(post.comments)}
      </TableCell>
      <TableCell className="text-center py-4 text-xs font-medium text-orange-500 align-middle">
        {Math.round((post.likes / post.views) * 100)}%
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={() => window.open(post.postPage, '_blank')}
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
        </Button>
      </TableCell>
      <TableCell className="text-center py-4 align-middle">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-muted"
          onClick={handleDownload}
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
        </Button>
      </TableCell>
    </TableRow>
  );
};