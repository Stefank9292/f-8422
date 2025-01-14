import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleDownload = async () => {
    // Get video URL from the nested structure
    const videoUrl = post.video?.url || post['video.url'];
    
    if (!videoUrl) {
      toast({
        title: "Video URL not available",
        description: "Unable to download video. Opening TikTok page instead.",
        variant: "destructive",
      });
      window.open(post.postPage, '_blank');
      return;
    }

    try {
      console.log('Attempting to download video:', videoUrl);
      
      // Call our Edge Function to download the video
      const { data, error } = await supabase.functions.invoke('tiktok-video-download', {
        body: { videoUrl }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message);
      }

      // Create a blob from the response
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = `tiktok-${post.id || 'video'}.mp4`;
      
      // Append to body, click, and cleanup
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your video download has started.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download video. Try opening in TikTok instead.",
        variant: "destructive",
      });
      window.open(post.postPage, '_blank');
    }
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="py-4 text-xs text-muted-foreground font-medium">
        @{post['channel.username'] || post.channel?.username || 'Unknown'}
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