import { InstagramPost } from "@/types/instagram";
import { cn } from "@/lib/utils";
import { Instagram, Play, Eye, Heart, MessageCircle, Zap, Download, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchResultDetailsProps {
  result: InstagramPost;
}

export function SearchResultDetails({ result }: SearchResultDetailsProps) {
  const { toast } = useToast();

  const handleCopyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast({
      description: "Caption copied to clipboard",
    });
  };

  const handleDownload = async (videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        description: "Download started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        description: "Failed to download video",
      });
    }
  };

  // Format engagement rate to always show 2 decimal places
  const formattedEngagement = typeof result.engagement === 'string' 
    ? `${parseFloat(result.engagement).toFixed(2)}%`
    : `${result.engagement.toFixed(2)}%`;

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-colors">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Instagram className="w-4 h-4 flex-shrink-0" />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline truncate"
            >
              @{result.ownerUsername}
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => window.open(result.url, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 text-rose-400" />
            </Button>
          </div>
          {result.videoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleDownload(result.videoUrl!)}
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
            </Button>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{result.caption}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleCopyCaption(result.caption)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-primary" />
                <span>{result.playsCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Plays</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-green-500" />
                <span>{result.viewsCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{result.likesCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Likes</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>{result.commentsCount.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span>{formattedEngagement}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Engagement Rate</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}